<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;
use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Задачи",
 *     description="API Endpoints для работы с задачами"
 * )
 */
class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/tasks",
     *     operationId="getTasksList",
     *     summary="Получить список задач",
     *     tags={"Задачи"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Поиск по названию или описанию",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Фильтр по статусу",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "in_progress", "completed"})
     *     ),
     *     @OA\Parameter(
     *         name="priority",
     *         in="query",
     *         description="Фильтр по приоритету",
     *         required=false,
     *         @OA\Schema(type="string", enum={"high", "medium", "low"})
     *     ),
     *     @OA\Parameter(
     *         name="client_id",
     *         in="query",
     *         description="Фильтр по ID клиента",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="deal_id",
     *         in="query",
     *         description="Фильтр по ID сделки",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="user_id",
     *         in="query",
     *         description="Фильтр по ID исполнителя",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="title", type="string"),
     *                     @OA\Property(property="description", type="string"),
     *                     @OA\Property(property="status", type="string", enum={"todo", "in_progress", "done", "cancelled"}),
     *                     @OA\Property(property="priority", type="string", enum={"high", "medium", "low"}),
     *                     @OA\Property(property="deadline", type="string", format="date"),
     *                     @OA\Property(property="user_id", type="integer"),
     *                     @OA\Property(property="client_id", type="integer", nullable=true),
     *                     @OA\Property(property="deal_id", type="integer", nullable=true),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="name", type="string")
     *                     ),
     *                     @OA\Property(
     *                         property="client",
     *                         type="object",
     *                         nullable=true,
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="name", type="string")
     *                     ),
     *                     @OA\Property(
     *                         property="deal",
     *                         type="object",
     *                         nullable=true,
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="name", type="string")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован"
     *     )
     * )
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasAnyPermission(['view tasks', 'view own tasks'])) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $query = Task::with(['user', 'client', 'deal']);

        if (!auth()->user()->hasPermissionTo('view tasks') && 
            auth()->user()->hasPermissionTo('view own tasks')) {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('deal_id')) {
            $query->where('deal_id', $request->deal_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $tasks = $query->paginate(10);
        $tasks->getCollection()->transform(function ($task) {
            $task->append('deadline');
            return $task;
        });
        return response()->json([
            'data' => $tasks->items(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/tasks",
     *     operationId="storeTask",
     *     summary="Создание новой задачи",
     *     tags={"Задачи"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "status", "priority", "deadline", "user_id"},
     *             @OA\Property(property="title", type="string", example="Подготовить КП"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="status", type="string", enum={"todo", "in_progress", "done", "cancelled"}),
     *             @OA\Property(property="priority", type="string", enum={"high", "medium", "low"}),
     *             @OA\Property(property="deadline", type="string", format="date"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="client_id", type="integer", nullable=true),
     *             @OA\Property(property="deal_id", type="integer", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Задача создана",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="priority", type="string"),
     *             @OA\Property(property="deadline", type="string", format="date"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="client_id", type="integer", nullable=true),
     *             @OA\Property(property="deal_id", type="integer", nullable=true),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function store(Request $request)
    {
        if (!auth()->user()->can('create tasks')) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:high,medium,low',
            'deadline' => 'required|date',
            'client_id' => 'nullable|exists:clients,id',
            'deal_id' => 'nullable|exists:deals,id',
        ]);

        $validated['user_id'] = auth()->id();

        $task = Task::create($validated);
        return response()->json($task->load('user', 'client', 'deal'), 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/tasks/{task}",
     *     operationId="showTask",
     *     summary="Получить информацию о задаче",
     *     tags={"Задачи"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="ID задачи",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="priority", type="string"),
     *             @OA\Property(property="deadline", type="string", format="date"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="client_id", type="integer", nullable=true),
     *             @OA\Property(property="deal_id", type="integer", nullable=true),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             ),
     *             @OA\Property(
     *                 property="client",
     *                 type="object",
     *                 nullable=true,
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             ),
     *             @OA\Property(
     *                 property="deal",
     *                 type="object",
     *                 nullable=true,
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Задача не найдена"
     *     )
     * )
     */
    public function show(Task $task)
    {
        if (!$this->canViewTask($task)) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        return response()->json($task->load('user', 'client', 'deal'));
    }

    /**
     * @OA\Put(
     *     path="/api/v1/tasks/{task}",
     *     operationId="updateTask",
     *     summary="Обновление задачи",
     *     tags={"Задачи"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="ID задачи",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="status", type="string", enum={"todo", "in_progress", "done", "cancelled"}),
     *             @OA\Property(property="priority", type="string", enum={"high", "medium", "low"}),
     *             @OA\Property(property="deadline", type="string", format="date"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="client_id", type="integer", nullable=true),
     *             @OA\Property(property="deal_id", type="integer", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Задача обновлена",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="priority", type="string"),
     *             @OA\Property(property="deadline", type="string", format="date"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="client_id", type="integer", nullable=true),
     *             @OA\Property(property="deal_id", type="integer", nullable=true),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Задача не найдена"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function update(Request $request, Task $task)
    {
        if (!$this->canEditTask($task)) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'priority' => 'sometimes|required|in:high,medium,low',
            'deadline' => 'sometimes|required|date',
            'user_id' => 'sometimes|required|exists:users,id',
            'client_id' => 'nullable|exists:clients,id',
            'deal_id' => 'nullable|exists:deals,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->all());
        return response()->json($task->load('user', 'client', 'deal'));
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/tasks/{task}",
     *     operationId="deleteTask",
     *     summary="Удаление задачи",
     *     tags={"Задачи"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="ID задачи",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Задача успешно удалена"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Задача не найдена"
     *     )
     * )
     */
    public function destroy(Task $task)
    {
        if (!auth()->user()->can('delete tasks')) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $task->delete();
        return response()->json(null, 204);
    }

    protected function canViewTask(Task $task): bool
    {
        if (auth()->user()->can('view tasks')) {
            return true;
        }

        return auth()->user()->can('view own tasks') && $task->user_id === auth()->id();
    }

    protected function canEditTask(Task $task): bool
    {
        if (auth()->user()->can('edit tasks')) {
            return true;
        }

        return auth()->user()->can('edit own tasks') && $task->user_id === auth()->id();
    }
} 
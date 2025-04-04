<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Client;
use App\Models\Deal;
use App\Models\User;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Requests\Task\UpdateRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCollection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\TaskService;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskService $taskService
    ) {
        $this->middleware('auth');
    }

    /**
     * Отображает список задач
     */
    public function index(): Response
    {
        if (!auth()->user()->hasAnyPermission(['view tasks', 'view own tasks'])) {
            abort(403);
        }

        $tasks = $this->taskService->getAllTasks(request()->only(['search', 'status', 'priority', 'client_id', 'deal_id', 'user_id']));
        $statistics = $this->taskService->getTaskStatistics();

        return Inertia::render('Tasks/Index', [
            'tasks' => new TaskCollection($tasks),
            'statistics' => $statistics,
            'filters' => request()->only(['search', 'status', 'priority', 'client_id', 'deal_id', 'user_id']),
            'clients' => Client::select('id', 'name')->get(),
            'deals' => Deal::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
            'can' => [
                'create' => auth()->user()->can('create tasks'),
                'edit' => auth()->user()->can('edit tasks'),
                'delete' => auth()->user()->can('delete tasks'),
            ]
        ]);
    }

    /**
     * Отображает форму создания задачи
     */
    public function create(): Response
    {
        if (!auth()->user()->can('create tasks')) {
            abort(403);
        }

        return Inertia::render('Tasks/Create', [
            'clients' => Client::select('id', 'name')->get(),
            'deals' => Deal::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    /**
     * Сохраняет новую задачу
     */
    public function store(StoreRequest $request): RedirectResponse
    {
        if (!auth()->user()->can('create tasks')) {
            abort(403);
        }

        try {
            $validated = $request->validated();
            $validated['user_id'] = auth()->id();
            $task = $this->taskService->createTask($validated);

            Log::info('Задача создана', ['task_id' => $task->id]);

            return redirect()->route('tasks.show', $task)
                ->with('success', 'Задача успешно создана.');
        } catch (\Exception $e) {
            Log::error('Ошибка при создании задачи', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return back()->with('error', 'Произошла ошибка при создании задачи.');
        }
    }

    /**
     * Отображает задачу
     */
    public function show(Task $task): Response
    {
        if (!$this->canViewTask($task)) {
            abort(403);
        }

        $task->load(['user', 'client', 'deal']);

        return Inertia::render('Tasks/Show', [
            'task' => new TaskResource($task),
            'clients' => Client::select('id', 'name')->get(),
            'deals' => Deal::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
            'can' => [
                'edit' => $this->canEditTask($task),
                'delete' => auth()->user()->can('delete tasks'),
            ]
        ]);
    }

    /**
     * Обновляет задачу
     */
    public function update(UpdateRequest $request, Task $task): RedirectResponse
    {
        if (!$this->canEditTask($task)) {
            abort(403);
        }

        try {
            Log::info('Получен запрос на обновление задачи', [
                'task_id' => $task->id,
                'request_data' => $request->all()
            ]);

            $this->taskService->updateTask($task, $request->validated());

            Log::info('Задача успешно обновлена', ['task' => $task->toArray()]);

            return redirect()->route('tasks.index')
                ->with('success', 'Задача успешно обновлена.');
        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении задачи', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return back()->with('error', 'Произошла ошибка при обновлении задачи.');
        }
    }

    /**
     * Удаляет задачу
     */
    public function destroy(Task $task): RedirectResponse
    {
        if (!auth()->user()->can('delete tasks')) {
            abort(403);
        }

        try {
            $taskId = $task->id;
            $this->taskService->deleteTask($task);

            Log::info('Задача удалена', ['task_id' => $taskId]);

            return redirect()->route('tasks.index')
                ->with('success', 'Задача успешно удалена.');
        } catch (\Exception $e) {
            Log::error('Ошибка при удалении задачи', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Произошла ошибка при удалении задачи.');
        }
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

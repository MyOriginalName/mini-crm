<?php

namespace App\Http\Controllers;

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

class TaskController extends Controller
{
    /**
     * Отображает список задач
     */
    public function index(): Response
    {
        $query = Task::with(['user', 'client', 'deal'])
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->when(request('client_id'), function ($query, $clientId) {
                $query->where('client_id', $clientId);
            })
            ->when(request('deal_id'), function ($query, $dealId) {
                $query->where('deal_id', $dealId);
            })
            ->when(request('user_id'), function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->latest();

        return Inertia::render('Tasks/Index', [
            'tasks' => new TaskCollection($query->paginate(10)),
            'filters' => request()->only(['search', 'status', 'priority', 'client_id', 'deal_id', 'user_id']),
            'clients' => Client::select('id', 'name')->get(),
            'deals' => Deal::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    /**
     * Отображает форму создания задачи
     */
    public function create(): Response
    {
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
        try {
            $validated = $request->validated();
            $task = Task::create($validated);

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
        $task->load(['user', 'client', 'deal']);

        return Inertia::render('Tasks/Show', [
            'task' => new TaskResource($task),
            'clients' => Client::select('id', 'name')->get(),
            'deals' => Deal::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    /**
     * Обновляет задачу
     */
    public function update(UpdateRequest $request, Task $task): RedirectResponse
    {
        try {
            Log::info('Получен запрос на обновление задачи', [
                'task_id' => $task->id,
                'request_data' => $request->all()
            ]);

            $validated = $request->validated();
            $task->update($validated);

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
        try {
            $taskId = $task->id;
            $task->delete();

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
}

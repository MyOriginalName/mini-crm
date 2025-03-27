<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    public function getAllTasks(array $filters = []): LengthAwarePaginator
    {
        $query = Task::query()->with(['user', 'client', 'deal']);

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view tasks') && auth()->user()->can('view own tasks')) {
            $query->where('user_id', auth()->id());
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        if (!empty($filters['deal_id'])) {
            $query->where('deal_id', $filters['deal_id']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->latest()->paginate(10);
    }

    public function getTaskStatistics(): Collection
    {
        $query = Task::selectRaw('status, COUNT(*) as count');

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view tasks') && auth()->user()->can('view own tasks')) {
            $query->where('user_id', auth()->id());
        }

        return $query->groupBy('status')->get();
    }

    public function getTasksForKanban(): Collection
    {
        $query = Task::with(['user', 'client', 'deal']);

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view tasks') && auth()->user()->can('view own tasks')) {
            $query->where('user_id', auth()->id());
        }

        return $query->latest()->get()->groupBy('status');
    }

    public function updateTaskStatus(Task $task, string $status): Task
    {
        $task->update(['status' => $status]);
        return $task->fresh();
    }

    public function createTask(array $data): Task
    {
        return Task::create($data);
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }
} 
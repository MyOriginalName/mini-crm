<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Получить список задач
    public function index()
    {
        return response()->json(
            Task::with(['client', 'user'])
                ->where('user_id', auth()->id())
                ->get()
        );
    }

    // Создать новую задачу
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,in_progress,completed'
        ]);

        $task = Task::create([
            'client_id' => $validated['client_id'],
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'] ?? 'pending'
        ]);

        return response()->json($task, 201);
    }

    // Обновить задачу
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:pending,in_progress,completed',
            'client_id' => 'sometimes|exists:clients,id'
        ]);

        $task->update($validated);
        $task->load(['client', 'user']);
        return response()->json($task);
    }
    
    // Показать задачу
    public function show(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $task->load(['client', 'user']);
        return response()->json($task);
    }

    // Удалить задачу
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}

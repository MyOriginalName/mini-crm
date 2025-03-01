<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Получить список задач
    public function index()
    {
        return response()->json(Task::with('client')->get());
    }

    // Создать новую задачу
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = Task::create([
            'client_id' => $validated['client_id'],
            'user_id' => auth()->id(), // <-- добавляем ID текущего пользователя
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        return response()->json($task, 201);
    }


    // Обновить задачу
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'string',
            'description' => 'nullable|string',
            'is_completed' => 'boolean'
        ]);

        $task->update($request->all());
        return response()->json($task);
    }
    
    // Показать задачу
    public function show(Task $task)
    {
        return response()->json($task);
    }


    // Удалить задачу
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Задача удалена']);
    }
}

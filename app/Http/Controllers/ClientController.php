<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // Получить список всех клиентов
    public function index()
    {
        return response()->json(Client::all());
    }

    // Создать нового клиента
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    // Получить данные конкретного клиента
    public function show(Client $client)
    {
        return response()->json($client);
    }

    // Обновить информацию о клиенте
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clients,email,' . $client->id,
            'phone' => 'sometimes|string|max:20',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    // Удалить клиента
    public function destroy(Client $client)
    {
        if (auth()->user()->id !== $client->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $client->delete();
        return response()->json(['message' => 'Deleted']);
    }

}

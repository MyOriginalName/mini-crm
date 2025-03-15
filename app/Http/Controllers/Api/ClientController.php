<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query()
            ->with('tags');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('tags.id', $request->get('tag'));
            });
        }

        $clients = $query->latest()->get();

        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $client = Client::create($validated);
        $client->tags()->sync($tags);

        return response()->json($client->load('tags'));
    }

    public function show(Client $client)
    {
        return response()->json($client->load('tags', 'deals'));
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $client->update($validated);
        $client->tags()->sync($tags);

        return response()->json($client->load('tags'));
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Клиент успешно удален']);
    }
} 
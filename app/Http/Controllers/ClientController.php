<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        $clients = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'tag']),
            'tags' => Tag::withCount('clients')->get(),
        ]);
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

        return redirect()->route('clients.index')
            ->with('message', 'Клиент успешно создан');
    }

    public function show(Client $client)
    {
        return Inertia::render('Clients/Show', [
            'client' => $client->load('deals', 'tags'),
            'tags' => Tag::all(),
        ]);
    }

    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
            'tags' => Tag::all(),
        ]);
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

        return back()->with('message', 'Клиент успешно обновлен');
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('message', 'Клиент успешно удален');
    }

    public function updateTags(Request $request, Client $client)
    {
        $validated = $request->validate([
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $client->tags()->sync($validated['tags']);

        return redirect()->back()
            ->with('message', 'Теги клиента обновлены');
    }
}

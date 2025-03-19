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

        $clients = $query->latest()->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'tags' => Tag::withCount('clients')->get(),
            'filters' => $request->only(['search', 'tag'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create', [
            'tags' => Tag::all()
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
            'tags.*' => 'integer|min:1|exists:tags,id',
        ]);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $client = Client::create($validated);
        
        if (!empty($tags)) {
            $client->tags()->sync($tags);
        }

        return redirect()->route('clients.index')
            ->with('success', 'Клиент успешно создан');
    }

    public function show(Client $client)
    {
        return Inertia::render('Clients/Show', [
            'client' => $client->load('tags', 'deals'),
            'tags' => Tag::all()
        ]);
    }

    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client->load('tags'),
            'tags' => Tag::all()
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
            'tags.*' => 'integer|min:1|exists:tags,id',
        ]);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $client->update($validated);
        $client->tags()->sync($tags);

        return redirect()->route('clients.index')
            ->with('success', 'Клиент успешно обновлен');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->route('clients.index')
            ->with('success', 'Клиент успешно удален');
    }

    public function updateTags(Request $request, Client $client)
    {
        $validated = $request->validate([
            'tags' => 'required|array',
            'tags.*' => 'integer|min:1|exists:tags,id',
        ]);

        $client->tags()->sync($validated['tags']);

        return redirect()->back()
            ->with('success', 'Теги успешно обновлены');
    }

    public function widget(Request $request)
    {
        try {
            \Log::info('Widget request received', [
                'filters' => $request->all()
            ]);

            $query = Client::query()
                ->latest();

            if ($request->filled('name')) {
                $query->where('name', 'like', "%{$request->get('name')}%");
            }

            if ($request->filled('email')) {
                $query->where('email', 'like', "%{$request->get('email')}%");
            }

            if ($request->filled('phone')) {
                $query->where('phone', 'like', "%{$request->get('phone')}%");
            }

            $clients = $query->paginate(10);

            \Log::info('Widget response', [
                'clients_count' => $clients->count()
            ]);

            return response()->json([
                'success' => true,
                'data' => $clients
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in widget method: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке клиентов'
            ], 500);
        }
    }

    public function widgetStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        return response()->json($client);
    }
} 
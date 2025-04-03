<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        if (!auth()->user()->hasAnyPermission(['view clients', 'view own clients'])) {
            abort(403);
        }

        $query = Client::query();

        if (!auth()->user()->hasPermissionTo('view clients') && 
            auth()->user()->hasPermissionTo('view own clients')) {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('type')) {
            $query->filterByType($request->get('type'));
        }

        if ($request->has('status')) {
            $query->filterByStatus($request->get('status'));
        }

        $clients = $query->latest()->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'type', 'status']),
            'can' => [
                'create' => auth()->user()->can('create clients'),
                'edit' => auth()->user()->can('edit clients'),
                'delete' => auth()->user()->can('delete clients'),
            ]
        ]);
    }

    public function create()
    {
        if (!auth()->user()->can('create clients')) {
            abort(403);
        }

        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        if (!auth()->user()->can('create clients')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|string|in:individual,company',
            'status' => 'required|string|in:active,inactive,blocked',
            'company_name' => 'nullable|required_if:type,company|string|max:255',
            'inn' => 'nullable|required_if:type,company|string|max:12',
            'kpp' => 'nullable|string|max:9',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        $client = Client::create($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Клиент успешно создан');
    }

    public function show(Client $client)
    {
        if (!$this->canViewClient($client)) {
            abort(403);
        }

        $client->load(['deals', 'tasks']);
        
        return Inertia::render('Clients/Show', [
            'client' => $client,
            'can' => [
                'edit' => auth()->user()->can('edit clients'),
                'delete' => auth()->user()->can('delete clients'),
            ]
        ]);
    }

    public function edit(Client $client)
    {
        if (!$this->canEditClient($client)) {
            abort(403);
        }

        return Inertia::render('Clients/Edit', [
            'client' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        if (!$this->canEditClient($client)) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:20',
            'type' => 'required|string|in:individual,company',
            'status' => 'required|string|in:active,inactive,blocked',
            'company_name' => 'required_if:type,company|nullable|string|max:255',
            'inn' => 'required_if:type,company|nullable|string|max:12',
            'kpp' => 'nullable|string|max:9',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $client->update($validated);

        return back()->with('success', 'Клиент успешно обновлен');
    }

    public function destroy(Client $client)
    {
        if (!auth()->user()->can('delete clients')) {
            abort(403);
        }

        $client->delete();
        return redirect()->route('clients.index')
            ->with('success', 'Клиент успешно удален');
    }

    protected function canViewClient(Client $client): bool
    {
        if (auth()->user()->can('view clients')) {
            return true;
        }

        return auth()->user()->can('view own clients') && $client->user_id === auth()->id();
    }

    protected function canEditClient(Client $client): bool
    {
        if (!auth()->user()->can('edit clients')) {
            return false;
        }

        if (auth()->user()->hasPermissionTo('edit clients')) {
            return true;
        }

        return $client->user_id === auth()->id();
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
} 
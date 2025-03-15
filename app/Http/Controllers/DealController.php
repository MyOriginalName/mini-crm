<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $query = Deal::with('client');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $deals = $query->paginate(10)
            ->withQueryString();

        $dealsByStatus = Deal::selectRaw('status, COUNT(*) as count, SUM(value) as total_value')
            ->groupBy('status')
            ->get();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
            'filters' => $request->only(['search', 'status']),
            'statistics' => $dealsByStatus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'status' => 'required|in:new,in_progress,won,lost',
            'description' => 'nullable|string',
        ]);

        Deal::create($validated);

        return redirect()->back()
            ->with('message', 'Сделка успешно создана');
    }

    public function show(Deal $deal)
    {
        return Inertia::render('Deals/Show', [
            'deal' => $deal->load('client'),
        ]);
    }

    public function update(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'status' => 'required|in:new,in_progress,won,lost',
            'description' => 'nullable|string',
        ]);

        $deal->update($validated);

        return redirect()->back()
            ->with('message', 'Сделка успешно обновлена');
    }

    public function destroy(Deal $deal)
    {
        $deal->delete();

        return redirect()->route('deals.index')
            ->with('message', 'Сделка успешно удалена');
    }

    public function kanban()
    {
        $deals = Deal::with('client')
            ->get()
            ->groupBy('status');

        return Inertia::render('Deals/Kanban', [
            'deals' => $deals,
        ]);
    }

    public function updateStatus(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,won,lost',
        ]);

        $deal->update($validated);

        return response()->json($deal);
    }
} 
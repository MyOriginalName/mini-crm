<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\Client;
use App\Services\DealService;
use App\Http\Requests\DealRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealController extends Controller
{
    public function __construct(
        private readonly DealService $dealService
    ) {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        if (!auth()->user()->hasAnyPermission(['view deals', 'view own deals'])) {
            abort(403);
        }

        $query = Deal::query();

        if (!auth()->user()->hasPermissionTo('view deals') && 
            auth()->user()->hasPermissionTo('view own deals')) {
            $query->where('user_id', auth()->id());
        }

        $deals = $this->dealService->getAllDeals($request->only(['search', 'status']));
        $statistics = $this->dealService->getDealStatistics();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
            'clients' => Client::all(),
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'status']),
            'can' => [
                'create' => auth()->user()->can('create deals'),
                'edit' => auth()->user()->can('edit deals'),
                'delete' => auth()->user()->can('delete deals'),
            ]
        ]);
    }

    public function kanban()
    {
        if (!auth()->user()->hasAnyPermission(['view deals', 'view own deals'])) {
            abort(403);
        }

        $deals = $this->dealService->getDealsForKanban();

        return Inertia::render('Deals/Kanban', [
            'deals' => $deals,
            'can' => [
                'edit' => auth()->user()->can('edit deals'),
                'delete' => auth()->user()->can('delete deals'),
            ]
        ]);
    }

    public function create()
    {
        if (!auth()->user()->can('create deals')) {
            abort(403);
        }

        return Inertia::render('Deals/Create', [
            'clients' => Client::all()
        ]);
    }

    public function store(DealRequest $request)
    {
        if (!auth()->user()->can('create deals')) {
            abort(403);
        }

        try {
            $validated = $request->validated();
            $validated['user_id'] = auth()->id();
            
            $deal = $this->dealService->createDeal($validated);

            return redirect()->route('deals.index')
                ->with('success', 'Сделка успешно создана');
        } catch (\Exception $e) {
            \Log::error('Ошибка при создании сделки', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return back()->with('error', 'Произошла ошибка при создании сделки');
        }
    }

    public function show(Deal $deal)
    {
        if (!$this->canViewDeal($deal)) {
            abort(403);
        }

        return Inertia::render('Deals/Show', [
            'deal' => $deal->load('client'),
            'can' => [
                'edit' => $this->canEditDeal($deal),
                'delete' => auth()->user()->can('delete deals'),
            ]
        ]);
    }

    public function edit(Deal $deal)
    {
        if (!$this->canEditDeal($deal)) {
            abort(403);
        }

        return Inertia::render('Deals/Edit', [
            'deal' => $deal->load('client'),
            'clients' => Client::all()
        ]);
    }

    public function update(DealRequest $request, Deal $deal)
    {
        if (!$this->canEditDeal($deal)) {
            abort(403);
        }

        try {
            $this->dealService->updateDeal($deal, $request->validated());

            return redirect()->route('deals.index')
                ->with('success', 'Сделка успешно обновлена');
        } catch (\Exception $e) {
            \Log::error('Ошибка при обновлении сделки', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return back()->with('error', 'Произошла ошибка при обновлении сделки');
        }
    }

    public function destroy(Deal $deal)
    {
        if (!auth()->user()->can('delete deals')) {
            abort(403);
        }

        try {
            $this->dealService->deleteDeal($deal);

            return redirect()->route('deals.index')
                ->with('success', 'Сделка успешно удалена');
        } catch (\Exception $e) {
            \Log::error('Ошибка при удалении сделки', [
                'error' => $e->getMessage(),
                'deal_id' => $deal->id
            ]);

            return back()->with('error', 'Произошла ошибка при удалении сделки');
        }
    }

    public function updateStatus(Request $request, Deal $deal)
    {
        if (!$this->canEditDeal($deal)) {
            abort(403);
        }

        try {
            $request->validate([
                'status' => 'required|string|in:suspended,in_progress,won,lost'
            ]);

            $this->dealService->updateDealStatus($deal, $request->status);
            $deals = $this->dealService->getDealsForKanban();

            return response()->json([
                'success' => true,
                'message' => 'Статус сделки успешно обновлен',
                'deals' => $deals
            ]);
        } catch (\Exception $e) {
            \Log::error('Ошибка при обновлении статуса сделки', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при обновлении статуса сделки'
            ], 500);
        }
    }

    protected function canViewDeal(Deal $deal): bool
    {
        return auth()->user()->hasPermissionTo('view deals') ||
            (auth()->user()->hasPermissionTo('view own deals') && $deal->user_id === auth()->id());
    }

    protected function canEditDeal(Deal $deal): bool
    {
        return auth()->user()->hasPermissionTo('edit deals') ||
            (auth()->user()->hasPermissionTo('edit own deals') && $deal->user_id === auth()->id());
    }
} 
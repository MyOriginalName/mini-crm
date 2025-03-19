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
    ) {}

    public function index(Request $request)
    {
        $deals = $this->dealService->getAllDeals($request->only(['search', 'status']));
        $statistics = $this->dealService->getDealStatistics();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
            'clients' => Client::all(),
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Deals/Create', [
            'clients' => Client::all()
        ]);
    }

    public function store(DealRequest $request)
    {
        $this->dealService->createDeal($request->validated());

        return redirect()->route('deals.index')
            ->with('success', 'Сделка успешно создана');
    }

    public function show(Deal $deal)
    {
        return Inertia::render('Deals/Show', [
            'deal' => $deal->load('client')
        ]);
    }

    public function edit(Deal $deal)
    {
        return Inertia::render('Deals/Edit', [
            'deal' => $deal->load('client'),
            'clients' => Client::all()
        ]);
    }

    public function update(DealRequest $request, Deal $deal)
    {
        $this->dealService->updateDeal($deal, $request->validated());

        return redirect()->route('deals.index')
            ->with('success', 'Сделка успешно обновлена');
    }

    public function destroy(Deal $deal)
    {
        $this->dealService->deleteDeal($deal);

        return redirect()->route('deals.index')
            ->with('success', 'Сделка успешно удалена');
    }

    public function updateStatus(Request $request, Deal $deal)
    {
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
            \Log::error('Error updating deal status', [
                'deal_id' => $deal->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при обновлении статуса сделки'
            ], 500);
        }
    }

    public function kanban()
    {
        return Inertia::render('Deals/Kanban', [
            'deals' => $this->dealService->getDealsForKanban()
        ]);
    }
} 
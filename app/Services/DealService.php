<?php

namespace App\Services;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DealService
{
    public function getAllDeals(array $filters = []): LengthAwarePaginator
    {
        $query = Deal::query()->with('client');

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view deals') && auth()->user()->can('view own deals')) {
            $query->where('user_id', auth()->id());
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate(10);
    }

    public function getDealStatistics(): Collection
    {
        $query = Deal::selectRaw('status, COUNT(*) as count, SUM(value) as total_value');

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view deals') && auth()->user()->can('view own deals')) {
            $query->where('user_id', auth()->id());
        }

        return $query->groupBy('status')->get();
    }

    public function getDealsForKanban(): Collection
    {
        $query = Deal::with('client');

        // Фильтрация по правам доступа
        if (!auth()->user()->can('view deals') && auth()->user()->can('view own deals')) {
            $query->where('user_id', auth()->id());
        }

        return $query->latest()->get()->groupBy('status');
    }

    public function updateDealStatus(Deal $deal, string $status): Deal
    {
        $deal->update(['status' => $status]);
        return $deal->fresh();
    }

    public function createDeal(array $data): Deal
    {
        return Deal::create($data);
    }

    public function updateDeal(Deal $deal, array $data): Deal
    {
        $deal->update($data);
        return $deal->fresh();
    }

    public function deleteDeal(Deal $deal): bool
    {
        return $deal->delete();
    }
} 
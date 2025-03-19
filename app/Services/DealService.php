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
        return Deal::selectRaw('status, COUNT(*) as count, SUM(value) as total_value')
            ->groupBy('status')
            ->get();
    }

    public function getDealsForKanban(): Collection
    {
        return Deal::with('client')
            ->latest()
            ->get()
            ->groupBy('status');
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
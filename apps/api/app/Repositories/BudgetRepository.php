<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\BudgetPlan;
use App\Models\BudgetItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class BudgetRepository
{
    public static function list(User $user): Collection
    {
        return BudgetPlan::where('user_id', $user->id)
            ->with(['items.categories'])
            ->get();
    }

    public static function findActive(User $user): ?BudgetPlan
    {
        return BudgetPlan::where('user_id', $user->id)
            ->where('is_active', true)
            ->with(['items.categories'])
            ->first();
    }

    public static function findById(string $id): ?BudgetPlan
    {
        return BudgetPlan::with(['items.categories'])->find($id);
    }

    public static function checkOverlap(User $user, string $startDate, string $endDate, ?string $excludeId = null): bool
    {
        $query = BudgetPlan::where('user_id', $user->id)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public static function deactivateOtherPlans(User $user, ?string $excludeId = null): void
    {
        $query = BudgetPlan::where('user_id', $user->id);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        $query->update(['is_active' => false]);
    }

    public static function store(User $user, array $data): BudgetPlan
    {
        return BudgetPlan::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'budget_method' => $data['budget_method'] ?? '50_30_20',
            'income_baseline' => $data['income_baseline'] ?? 0,
            'period' => $data['period'] ?? 'monthly',
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_active' => $data['is_active'] ?? true,
            'rollover_enabled' => $data['rollover_enabled'] ?? false,
        ])->load('items.categories');
    }

    public static function updatePlan(BudgetPlan $plan, array $data): BudgetPlan
    {
        $plan->update($data);
        return $plan->fresh()->load('items.categories');
    }

    public static function storeItem(BudgetPlan $plan, array $itemData): BudgetItem
    {
        $item = $plan->items()->create([
            'name' => $itemData['name'],
            'type' => $itemData['type'] ?? null,
            'percentage' => $itemData['percentage'] ?? 0,
            'amount_limit' => $itemData['amount_limit'] ?? 0,
            'color' => $itemData['color'] ?? null,
            'icon' => $itemData['icon'] ?? null,
        ]);

        if (!empty($itemData['category_ids'])) {
            $item->categories()->sync($itemData['category_ids']);
        }

        return $item;
    }

    public static function deleteItems(BudgetPlan $plan): void
    {
        $plan->items()->delete();
    }

    public static function getUtilizationSpent(BudgetItem $item, string $dateFrom, string $dateTo): float
    {
        return (float) DB::table('transactions')
            ->where('budget_item_id', $item->id)
            ->whereBetween('tx_date', [$dateFrom, $dateTo])
            ->sum('amount');
    }

    public static function destroy(BudgetPlan $plan): void
    {
        $plan->delete();
    }
}

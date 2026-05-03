<?php

namespace App\Services;

use App\Models\User;
use App\Models\BudgetPlan;
use App\Models\BudgetItem;
use App\Models\BudgetItemCategory;
use App\Repositories\BudgetRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class BudgetService
{
    /**
     * List all budget plans for the user.
     */
    public static function list(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return BudgetRepository::list($user);
    }

    public static function store(User $user, array $data): BudgetPlan
    {
        return DB::transaction(function () use ($user, $data) {
            $startDate = $data['start_date'] ?? now()->startOfMonth()->toDateString();
            $endDate = $data['end_date'] ?? now()->endOfMonth()->toDateString();

            // Validate overlap
            $overlap = BudgetPlan::where('user_id', $user->id)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                })->exists();

            if ($overlap) {
                throw new Exception("Budget plan overlaps with an existing plan's period.");
            }

            // Deactivate other plans if this one is active (though now we use dates)
            if (!empty($data['is_active'])) {
                BudgetPlan::where('user_id', $user->id)->update(['is_active' => false]);
            }

            $plan = BudgetPlan::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'budget_method' => $data['budget_method'] ?? '50_30_20',
                'income_baseline' => $data['income_baseline'] ?? 0,
                'period' => $data['period'] ?? 'monthly',
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_active' => $data['is_active'] ?? true,
                'rollover_enabled' => $data['rollover_enabled'] ?? false,
            ]);

            if (!empty($data['items'])) {
                foreach ($data['items'] as $itemData) {
                    $percentage = $itemData['percentage'] ?? 0;
                    $amountLimit = $itemData['amount_limit'] ?? 0;

                    // Jika limit nol tapi persentase ada, hitung otomatis dari baseline
                    if ($amountLimit <= 0 && $percentage > 0 && $plan->income_baseline > 0) {
                        $amountLimit = ($percentage / 100) * $plan->income_baseline;
                    }

                    $item = $plan->items()->create([
                        'name' => $itemData['name'],
                        'percentage' => $percentage,
                        'amount_limit' => $amountLimit,
                        'color' => $itemData['color'] ?? null,
                        'icon' => $itemData['icon'] ?? null,
                    ]);

                    if (!empty($itemData['category_ids'])) {
                        $item->categories()->sync($itemData['category_ids']);
                    }
                }
            }

            return $plan->load('items.categories');
        });
    }

    public static function update(User $user, string $id, array $data): BudgetPlan
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $plan = BudgetRepository::findById($id);
            if (!$plan || $plan->user_id !== $user->id) {
                throw new Exception('Budget plan tidak ditemukan');
            }

            if (isset($data['start_date']) || isset($data['end_date'])) {
                $startDate = $data['start_date'] ?? $plan->start_date->toDateString();
                $endDate = $data['end_date'] ?? $plan->end_date->toDateString();

                // Validate overlap excluding itself
                $overlap = BudgetPlan::where('user_id', $user->id)
                    ->where('id', '!=', $id)
                    ->where(function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('start_date', [$startDate, $endDate])
                            ->orWhereBetween('end_date', [$startDate, $endDate])
                            ->orWhere(function ($q) use ($startDate, $endDate) {
                                $q->where('start_date', '<=', $startDate)
                                    ->where('end_date', '>=', $endDate);
                            });
                    })->exists();

                if ($overlap) {
                    throw new Exception("Budget plan overlaps with an existing plan's period.");
                }
            }

            if (isset($data['is_active']) && $data['is_active']) {
                BudgetPlan::where('user_id', $user->id)->where('id', '!=', $id)->update(['is_active' => false]);
            }

            $plan->update($data);

            if (isset($data['items'])) {
                // For simplicity in this plan, we replace items if provided
                $plan->items()->delete();
                foreach ($data['items'] as $itemData) {
                    $percentage = $itemData['percentage'] ?? 0;
                    $amountLimit = $itemData['amount_limit'] ?? 0;

                    // Jika limit nol tapi persentase ada, hitung otomatis dari baseline
                    if ($amountLimit <= 0 && $percentage > 0 && $plan->income_baseline > 0) {
                        $amountLimit = ($percentage / 100) * $plan->income_baseline;
                    }

                    $item = $plan->items()->create([
                        'name' => $itemData['name'],
                        'percentage' => $percentage,
                        'amount_limit' => $amountLimit,
                        'color' => $itemData['color'] ?? null,
                        'icon' => $itemData['icon'] ?? null,
                    ]);

                    if (!empty($itemData['category_ids'])) {
                        $item->categories()->sync($itemData['category_ids']);
                    }
                }
            }

            return $plan->fresh()->load('items.categories');
        });
    }

    /**
     * Duplicate an existing plan.
     */
    public static function duplicate(User $user, string $id, array $newData = []): BudgetPlan
    {
        return DB::transaction(function () use ($user, $id, $newData) {
            $sourcePlan = BudgetRepository::findById($id);
            if (!$sourcePlan || $sourcePlan->user_id !== $user->id) {
                throw new Exception('Budget plan tidak ditemukan');
            }

            $startDate = $newData['start_date'] ?? now()->startOfMonth()->toDateString();
            $endDate = $newData['end_date'] ?? now()->endOfMonth()->toDateString();

            // Validate overlap
            $overlap = BudgetPlan::where('user_id', $user->id)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                })->exists();

            if ($overlap) {
                throw new Exception("Budget plan overlaps with an existing plan's period.");
            }

            $newPlan = BudgetPlan::create([
                'user_id' => $user->id,
                'name' => $newData['name'] ?? "Copy of " . $sourcePlan->name,
                'budget_method' => $sourcePlan->budget_method,
                'income_baseline' => $newData['income_baseline'] ?? $sourcePlan->income_baseline,
                'period' => $sourcePlan->period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_active' => $newData['is_active'] ?? false,
                'rollover_enabled' => $sourcePlan->rollover_enabled,
            ]);

            foreach ($sourcePlan->items as $item) {
                $newItem = $newPlan->items()->create([
                    'name' => $item->name,
                    'percentage' => $item->percentage,
                    'amount_limit' => $item->amount_limit,
                    'color' => $item->color,
                    'icon' => $item->icon,
                ]);

                $newItem->categories()->sync($item->categories->pluck('id'));
            }

            return $newPlan->load('items.categories');
        });
    }

    /**
     * Delete a budget plan.
     */
    public static function destroy(User $user, string $id): void
    {
        $plan = BudgetRepository::findById($id);
        if (!$plan || $plan->user_id !== $user->id) {
            throw new Exception('Budget plan tidak ditemukan');
        }
        $plan->delete();
    }

    /**
     * Get utilization data for a plan.
     */
    public static function getUtilization(User $user, ?string $planId = null): ?array
    {
        $plan = $planId 
            ? BudgetRepository::findById($planId)
            : BudgetRepository::findActive($user);

        if (!$plan || $plan->user_id !== $user->id) {
            return null;
        }

        $dateFrom = $plan->start_date;
        $dateTo = $plan->end_date;

        $results = [];
        foreach ($plan->items as $item) {
            $spent = DB::table('transactions')
                ->where('budget_item_id', $item->id)
                ->whereBetween('tx_date', [$dateFrom, $dateTo])
                ->sum('amount');

            $limit = $item->amount_limit;
            if ($item->percentage && $plan->income_baseline > 0) {
                $limit = ($item->percentage / 100) * $plan->income_baseline;
            }

            $results[] = [
                'id' => $item->id,
                'name' => $item->name,
                'spent' => (float) $spent,
                'limit' => (float) $limit,
                'percentage_used' => $limit > 0 ? round(($spent / $limit) * 100, 2) : 0,
                'color' => $item->color,
                'icon' => $item->icon,
            ];
        }

        return [
            'id' => $plan->id,
            'plan' => $plan->name,
            'budget_method' => $plan->budget_method,
            'period' => $plan->period,
            'period_start' => $dateFrom->toDateString(),
            'period_end' => $dateTo->toDateString(),
            'income_baseline' => (float) $plan->income_baseline,
            'items' => $results,
        ];
    }
}

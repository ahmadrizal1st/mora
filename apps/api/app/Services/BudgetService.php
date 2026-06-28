<?php

namespace App\Services;

use App\Models\User;
use App\Models\BudgetPlan;
use App\Repositories\BudgetRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class BudgetService
{
    
    public static function list(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return BudgetRepository::list($user);
    }

    public static function store(User $user, array $data): BudgetPlan
    {
        return DB::transaction(function () use ($user, $data) {
            $startDate = $data['start_date'] ?? now()->startOfMonth()->toDateString();
            $endDate = $data['end_date'] ?? now()->endOfMonth()->toDateString();

            
            $overlap = BudgetRepository::checkOverlap($user, $startDate, $endDate);
            if ($overlap) {
                throw new Exception("Budget plan overlaps with an existing plan's period.");
            }

            
            if (!empty($data['is_active'])) {
                BudgetRepository::deactivateOtherPlans($user);
            }

            $planData = array_merge($data, [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]);
            $plan = BudgetRepository::store($user, $planData);

            if (!empty($data['items'])) {
                foreach ($data['items'] as $itemData) {
                    $itemData['amount_limit'] = $itemData['amount_limit'] ?? 0;
                    $itemData['percentage'] = $itemData['percentage'] ?? 0;
                    
                    if ($itemData['amount_limit'] <= 0 && $itemData['percentage'] > 0 && $plan->income_baseline > 0) {
                        $itemData['amount_limit'] = ($itemData['percentage'] / 100) * $plan->income_baseline;
                    }
                    BudgetRepository::storeItem($plan, $itemData);
                }
            }

            return $plan->fresh()->load('items.categories');
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

                
                $overlap = BudgetRepository::checkOverlap($user, $startDate, $endDate, $id);
                if ($overlap) {
                    throw new Exception("Budget plan overlaps with an existing plan's period.");
                }
            }

            if (isset($data['is_active']) && $data['is_active']) {
                BudgetRepository::deactivateOtherPlans($user, $id);
            }

            $plan = BudgetRepository::updatePlan($plan, $data);

            if (isset($data['items'])) {
                
                BudgetRepository::deleteItems($plan);
                foreach ($data['items'] as $itemData) {
                    $itemData['amount_limit'] = $itemData['amount_limit'] ?? 0;
                    $itemData['percentage'] = $itemData['percentage'] ?? 0;
                    
                    if ($itemData['amount_limit'] <= 0 && $itemData['percentage'] > 0 && $plan->income_baseline > 0) {
                        $itemData['amount_limit'] = ($itemData['percentage'] / 100) * $plan->income_baseline;
                    }
                    BudgetRepository::storeItem($plan, $itemData);
                }
            }

            return $plan->fresh()->load('items.categories');
        });
    }

    
    public static function duplicate(User $user, string $id, array $newData = []): BudgetPlan
    {
        return DB::transaction(function () use ($user, $id, $newData) {
            $sourcePlan = BudgetRepository::findById($id);
            if (!$sourcePlan || $sourcePlan->user_id !== $user->id) {
                throw new Exception('Budget plan tidak ditemukan');
            }

            $startDate = $newData['start_date'] ?? now()->startOfMonth()->toDateString();
            $endDate = $newData['end_date'] ?? now()->endOfMonth()->toDateString();

            
            $overlap = BudgetRepository::checkOverlap($user, $startDate, $endDate);
            if ($overlap) {
                throw new Exception("Budget plan overlaps with an existing plan's period.");
            }

            $planData = [
                'name' => $newData['name'] ?? "Copy of " . $sourcePlan->name,
                'budget_method' => $sourcePlan->budget_method,
                'income_baseline' => $newData['income_baseline'] ?? $sourcePlan->income_baseline,
                'period' => $sourcePlan->period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_active' => $newData['is_active'] ?? false,
                'rollover_enabled' => $sourcePlan->rollover_enabled,
            ];
            $newPlan = BudgetRepository::store($user, $planData);

            foreach ($sourcePlan->items as $item) {
                $itemData = [
                    'name' => $item->name,
                    'percentage' => $item->percentage,
                    'amount_limit' => $item->amount_limit,
                    'color' => $item->color,
                    'icon' => $item->icon,
                    'category_ids' => $item->categories->pluck('id')
                ];
                BudgetRepository::storeItem($newPlan, $itemData);
            }

            return $newPlan->fresh()->load('items.categories');
        });
    }

    
    public static function destroy(User $user, string $id): void
    {
        $plan = BudgetRepository::findById($id);
        if (!$plan || $plan->user_id !== $user->id) {
            throw new Exception('Budget plan tidak ditemukan');
        }
        BudgetRepository::destroy($plan);
    }

    
    public static function getUtilization(User $user, ?string $planId = null): ?array
    {
        $plan = $planId 
            ? BudgetRepository::findById($planId)
            : BudgetRepository::findActive($user);

        if (!$plan || $plan->user_id !== $user->id) {
            return null;
        }

        $dateFrom = $plan->start_date->toDateString();
        $dateTo = $plan->end_date->toDateString();

        $results = [];
        foreach ($plan->items as $item) {
            $spent = BudgetRepository::getUtilizationSpent($item, $dateFrom, $dateTo);
            $limit = $item->amount_limit;
            if ($item->percentage && $plan->income_baseline > 0) {
                $limit = ($item->percentage / 100) * $plan->income_baseline;
            }

            $results[] = [
                'id' => $item->id,
                'name' => $item->name,
                'spent' => $spent,
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
            'period_start' => $dateFrom,
            'period_end' => $dateTo,
            'income_baseline' => (float) $plan->income_baseline,
            'items' => $results,
        ];
    }
}

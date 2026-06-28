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
                    'type' => $item->type,
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
                'type' => $item->type,
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

    public static function getInsights(User $user, ?string $planId = null): array
    {
        $util = self::getUtilization($user, $planId);
        
        $topCategory = null;
        $terhemat = null;
        $overbudget = null;

        if ($util && !empty($util['items'])) {
            $items = collect($util['items']);
            
            $topItem = $items->sortByDesc('spent')->first();
            if ($topItem && $topItem['spent'] > 0) {
                $topCategory = [
                    'value' => $topItem['name'],
                    'subvalue' => 'Rp ' . number_format($topItem['spent'], 0, ',', '.'),
                    'icon' => $topItem['icon'] ?? 'shopping-cart',
                    'solidColor' => $topItem['color'] ?? '#d95c00',
                    'trend' => 'Max spent',
                    'trendUp' => true
                ];
            }

            $terhematItem = $items->filter(fn($i) => $i['percentage_used'] > 0 && $i['percentage_used'] <= 100)
                                  ->sortBy('percentage_used')->first();
            if ($terhematItem) {
                $terhemat = [
                    'value' => $terhematItem['name'],
                    'subvalue' => $terhematItem['percentage_used'] . '% Limit',
                    'icon' => $terhematItem['icon'] ?? 'device-tv',
                    'solidColor' => $terhematItem['color'] ?? '#0f9d58',
                    'trend' => 'Good',
                    'trendUp' => false
                ];
            }

            $overbudgetItem = $items->filter(fn($i) => $i['percentage_used'] > 100)
                                    ->sortByDesc('percentage_used')->first();
            if ($overbudgetItem) {
                $overbudget = [
                    'value' => $overbudgetItem['name'],
                    'subvalue' => '+Rp ' . number_format($overbudgetItem['spent'] - $overbudgetItem['limit'], 0, ',', '.'),
                    'icon' => $overbudgetItem['icon'] ?? 'car',
                    'solidColor' => $overbudgetItem['color'] ?? '#e02424',
                    'trend' => 'Over',
                    'trendUp' => true
                ];
            }
        }

        $savings = \App\Models\Goal::where('user_id', $user->id)->sum('current_amount');
        $target = \App\Models\Goal::where('user_id', $user->id)->sum('target_amount');
        $savingsGoal = [
            'value' => 'Total Tersimpan',
            'subvalue' => 'Rp ' . number_format($savings, 0, ',', '.'),
            'icon' => 'target',
            'solidColor' => '#10b981',
            'trend' => $target > 0 ? round(($savings / $target) * 100) . '%' : '0%',
            'trendUp' => false
        ];

        $paidSub = \App\Models\Subscription::where('user_id', $user->id)->where('status', 'paid')->sum('amount');
        $smartSaving = [
            'value' => 'Subscription Paid',
            'subvalue' => 'Rp ' . number_format($paidSub, 0, ',', '.'),
            'icon' => 'refresh',
            'solidColor' => '#3b82f6',
            'trend' => 'Monthly',
            'trendUp' => false
        ];

        // 3 New Insights
        $totalPlanIncome = $util ? $util['income_baseline'] : 0;
        $totalSpent = $util ? collect($util['items'])->sum('spent') : 0;
        $remainingBudget = max(0, $totalPlanIncome - $totalSpent);
        $sisaSaldo = [
            'value' => 'Sisa Anggaran',
            'subvalue' => 'Rp ' . number_format($remainingBudget, 0, ',', '.'),
            'icon' => 'wallet',
            'solidColor' => '#206bc4',
            'trend' => $totalPlanIncome > 0 ? round(($remainingBudget / $totalPlanIncome) * 100) . '% Sisa' : '0%',
            'trendUp' => false
        ];

        $today = now();
        $startOfMonth = $today->copy()->startOfMonth()->toDateString();
        $endOfMonth = $today->copy()->endOfMonth()->toDateString();
        
        return [
            'top_category' => $topCategory,
            'terhemat' => $terhemat,
            'overbudget' => $overbudget,
            'savings_goal' => $savingsGoal,
            'smart_saving' => $smartSaving,
            'sisa_saldo' => $sisaSaldo,
        ];
    }

    public static function getHistory(User $user, int $months = 6): array
    {
        $history = [];
        $today = now();

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = $today->copy()->subMonths($i);
            $monthStr = $date->format('M Y');
            $startOfMonth = $date->copy()->startOfMonth()->toDateString();
            $endOfMonth = $date->copy()->endOfMonth()->toDateString();

            $plan = \App\Models\BudgetPlan::where('user_id', $user->id)
                ->where('start_date', '<=', $endOfMonth)
                ->where('end_date', '>=', $startOfMonth)
                ->orderBy('created_at', 'desc')
                ->first();

            $planned = $plan ? $plan->income_baseline : 0;

            $actual = DB::table('transactions')
                ->join('budget_items', 'transactions.budget_item_id', '=', 'budget_items.id')
                ->join('budget_plans', 'budget_items.budget_plan_id', '=', 'budget_plans.id')
                ->where('budget_plans.user_id', $user->id)
                ->whereBetween('tx_date', [$startOfMonth, $endOfMonth])
                ->sum('transactions.amount');

            $needs = DB::table('transactions')
                ->join('budget_items', 'transactions.budget_item_id', '=', 'budget_items.id')
                ->join('budget_plans', 'budget_items.budget_plan_id', '=', 'budget_plans.id')
                ->where('budget_plans.user_id', $user->id)
                ->where('budget_items.type', 'needs')
                ->whereBetween('tx_date', [$startOfMonth, $endOfMonth])
                ->sum('transactions.amount');

            $wants = DB::table('transactions')
                ->join('budget_items', 'transactions.budget_item_id', '=', 'budget_items.id')
                ->join('budget_plans', 'budget_items.budget_plan_id', '=', 'budget_plans.id')
                ->where('budget_plans.user_id', $user->id)
                ->where('budget_items.type', 'wants')
                ->whereBetween('tx_date', [$startOfMonth, $endOfMonth])
                ->sum('transactions.amount');

            $savings = DB::table('transactions')
                ->join('budget_items', 'transactions.budget_item_id', '=', 'budget_items.id')
                ->join('budget_plans', 'budget_items.budget_plan_id', '=', 'budget_plans.id')
                ->where('budget_plans.user_id', $user->id)
                ->where('budget_items.type', 'savings')
                ->whereBetween('tx_date', [$startOfMonth, $endOfMonth])
                ->sum('transactions.amount');

            $history[] = [
                'month' => $monthStr,
                'planned' => (float)$planned,
                'actual' => (float)$actual,
                'needs' => (float)$needs,
                'wants' => (float)$wants,
                'savings' => (float)$savings,
            ];
        }

        return $history;
    }
}

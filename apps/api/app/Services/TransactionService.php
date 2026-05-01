<?php

namespace App\Services;

use App\Models\BudgetItemCategory;
use App\Models\Transaction;
use App\Models\User;
use App\Repositories\TransactionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class TransactionService
{
    /**
     * List transactions for a user with filters and pagination.
     */
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        return TransactionRepository::list($user, $filters);
    }

    /**
     * Create a new transaction and update account balances.
     */
    public static function store(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            $account = $user->accounts()->findOrFail($data['account_id']);

            $txData = [
                'user_id' => $user->id,
                'type' => $data['type'],
                'amount_raw' => $data['amount_raw'],
                'currency_id' => $data['currency_id'] ?? $account->currency_id,
                'rate_snapshot' => $data['rate_snapshot'] ?? 1,
                'amount_in_default' => $data['amount_in_default'] ?? $data['amount_raw'],
                'account_id' => $data['account_id'],
                'to_account_id' => $data['to_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'budget_item_id' => $data['budget_item_id'] ?? null,
                'status_id' => $data['status_id'] ?? null,
                'recurring_type_id' => $data['recurring_type_id'] ?? null,
                'tx_date' => $data['tx_date'],
                'merchant' => $data['merchant'] ?? null,
                'notes' => $data['notes'] ?? null,
                'dynamic_fields' => $data['dynamic_fields'] ?? null,
            ];

            // Auto-fill budget_item_id from default category mapping if not provided
            if (empty($txData['budget_item_id']) && !empty($txData['category_id'])) {
                $mapping = BudgetItemCategory::where('category_id', $txData['category_id'])
                    ->whereHas('budgetItem.plan', function ($query) use ($user) {
                        $query->where('user_id', $user->id)->where('is_active', true);
                    })->first();

                if ($mapping) {
                    $txData['budget_item_id'] = $mapping->budget_item_id;
                }
            }

            if ($data['type'] === Transaction::TYPE_TRANSFER) {
                if (empty($data['to_account_id'])) {
                    throw ValidationException::withMessages([
                        'to_account_id' => ['Akun tujuan wajib diisi untuk transfer.'],
                    ]);
                }
                if ($data['account_id'] === $data['to_account_id']) {
                    throw ValidationException::withMessages([
                        'to_account_id' => ['Akun tujuan tidak boleh sama dengan akun asal.'],
                    ]);
                }
                $user->accounts()->findOrFail($data['to_account_id']);
            }

            $transaction = Transaction::create($txData);

            if (!empty($data['tag_ids'])) {
                $validTagIds = $user->tags()->whereIn('id', $data['tag_ids'])->pluck('id');
                $transaction->tags()->sync($validTagIds);
            }

            return $transaction->load([
                'account',
                'toAccount',
                'category',
                'budgetItem',
                'status',
                'currency',
                'recurringType',
                'tags',
            ]);
        });
    }

    /**
     * Get a single transaction with all relationships.
     */
    public static function show(User $user, int $id): Transaction
    {
        return $user->transactions()
            ->with(['account', 'toAccount', 'category', 'budgetItem', 'status', 'currency', 'recurringType', 'tags'])
            ->findOrFail($id);
    }

    /**
     * Update a transaction and re-calculate account balances.
     */
    public static function update(User $user, int $id, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $transaction = $user->transactions()->findOrFail($id);

            if (!empty($data['account_id'])) {
                $user->accounts()->findOrFail($data['account_id']);
            }
            if (!empty($data['to_account_id'])) {
                $user->accounts()->findOrFail($data['to_account_id']);
            }

            $transaction->update($data);

            if (array_key_exists('tag_ids', $data)) {
                $validTagIds = $user->tags()->whereIn('id', $data['tag_ids'] ?? [])->pluck('id');
                $transaction->tags()->sync($validTagIds);
            }

            return $transaction->fresh()->load([
                'account',
                'toAccount',
                'category',
                'budgetItem',
                'status',
                'currency',
                'recurringType',
                'tags',
            ]);
        });
    }

    /**
     * Delete a transaction and revert its balance effect.
     */
    public static function destroy(User $user, int $id): void
    {
        DB::transaction(function () use ($user, $id) {
            $transaction = $user->transactions()->findOrFail($id);

            $transaction->tags()->detach();
            $transaction->delete();
        });
    }

    /**
     * Get summary statistics for a period.
     */
    public static function summary(User $user, array $filters = []): array
    {
        $dateFromRaw = $filters['date_from'] ?? null;
        $dateToRaw   = $filters['date_to']   ?? null;

        $dateFrom = $dateFromRaw ? Carbon::parse($dateFromRaw)->startOfDay() : null;
        $dateTo   = $dateToRaw   ? Carbon::parse($dateToRaw)->endOfDay()     : null;

        $currentFilters = array_merge($filters, [
            'date_from' => $dateFrom ? $dateFrom->toDateTimeString() : null,
            'date_to'   => $dateTo   ? $dateTo->toDateTimeString()   : null,
        ]);

        [$income, $expense, $count] = TransactionRepository::getSummaryTotals($user, $currentFilters);

        $prevIncome  = 0;
        $prevExpense = 0;
        $prevCount   = 0;

        if ($dateFrom && $dateTo) {
            $diffInDays  = $dateFrom->diffInDays($dateTo) + 1;

            $prevTo      = $dateFrom->copy()->subDay()->endOfDay();
            $prevFrom    = $prevTo->copy()->subDays($diffInDays - 1)->startOfDay();

            $prevFilters = array_merge($filters, [
                'date_from' => $prevFrom->toDateTimeString(),
                'date_to'   => $prevTo->toDateTimeString(),
            ]);

            [$prevIncome, $prevExpense, $prevCount] = TransactionRepository::getSummaryTotals($user, $prevFilters);
        }

        $calcTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100.0 : 0.0;
            }
            return round((($current - $previous) / $previous) * 100, 1);
        };

        return [
            'total_income'      => (int) $income,
            'total_expense'     => (int) $expense,
            'net_balance'       => (int) ($income - $expense),
            'transaction_count' => $count,
            'income_trend'      => (float) $calcTrend($income, $prevIncome),
            'expense_trend'     => (float) $calcTrend($expense, $prevExpense),
            'count_trend'       => (float) $calcTrend($count, $prevCount),
            'balance_trend'     => (float) $calcTrend($income - $expense, $prevIncome - $prevExpense),
        ];
    }

    /**
     * Get historical aggregated data for charts.
     */
    public static function history(User $user, array $filters = []): array
    {
        $groupBy = $filters['group_by'] ?? 'day';

        $pgFormat = match ($groupBy) {
            'week'  => 'IYYY-"W"IW',
            'month' => 'YYYY-MM',
            'year'  => 'YYYY',
            default => 'YYYY-MM-DD',
        };

        $baseFilters = [
            'date_from'  => $filters['date_from'] ?? null,
            'date_to'    => $filters['date_to'] ?? null,
            'account_id' => $filters['account_id'] ?? null,
        ];

        if (empty($baseFilters['date_from']) || empty($baseFilters['date_to'])) {
            $currentTo = Carbon::now()->endOfDay();
            $currentFrom = $currentTo->copy()->subDays(29)->startOfDay();
        } else {
            $currentFrom = Carbon::parse($baseFilters['date_from'])->startOfDay();
            $currentTo   = Carbon::parse($baseFilters['date_to'])->endOfDay();
        }

        // Align boundaries
        match ($groupBy) {
            'week'  => [$currentFrom->startOfWeek(), $currentTo->endOfWeek()],
            'month' => [$currentFrom->startOfMonth(), $currentTo->endOfMonth()],
            'year'  => [$currentFrom->startOfYear(), $currentTo->endOfYear()],
            default => [$currentFrom->startOfDay(), $currentTo->endOfDay()],
        };

        if ($groupBy === 'month') {
            $n = $currentFrom->diffInMonths($currentTo) + 1;
            $prevTo = $currentFrom->copy()->subDay()->endOfMonth();
            $prevFrom = $prevTo->copy()->subMonths($n - 1)->startOfMonth();
        } elseif ($groupBy === 'week') {
            $n = $currentFrom->diffInWeeks($currentTo) + 1;
            $prevTo = $currentFrom->copy()->subDay()->endOfWeek();
            $prevFrom = $prevTo->copy()->subWeeks($n - 1)->startOfWeek();
        } elseif ($groupBy === 'year') {
            $n = $currentFrom->diffInYears($currentTo) + 1;
            $prevTo = $currentFrom->copy()->subDay()->endOfYear();
            $prevFrom = $prevTo->copy()->subYears($n - 1)->startOfYear();
        } else {
            $n = $currentFrom->diffInDays($currentTo) + 1;
            $prevTo = $currentFrom->copy()->subDay()->endOfDay();
            $prevFrom = $prevTo->copy()->subDays($n - 1)->startOfDay();
        }

        $currentFilters = array_merge($baseFilters, [
            'date_from' => $currentFrom->toDateTimeString(),
            'date_to'   => $currentTo->toDateTimeString(),
        ]);
        $rawResults = TransactionRepository::fetchHistoryRows($user, $pgFormat, $currentFilters)->keyBy('label');

        $prevFilters = array_merge($baseFilters, [
            'date_from' => $prevFrom->toDateTimeString(),
            'date_to'   => $prevTo->toDateTimeString(),
        ]);
        $prevResults = TransactionRepository::fetchHistoryRows($user, $pgFormat, $prevFilters)->keyBy('label');

        $income = [];
        $expense = [];
        $count = [];
        $labels = [];
        $p_income = [];
        $p_expense = [];
        $p_count = [];

        $curr = $currentFrom->copy();
        $prev = $prevFrom->copy();

        $phpFormat = match ($groupBy) {
            'week'  => 'o-\WW',
            'month' => 'Y-m',
            'year'  => 'Y',
            default => 'Y-m-d',
        };

        $safety = 0;
        while ($curr->lte($currentTo) && $safety < 1000) {
            $safety++;
            $dbLabel = $curr->format($phpFormat);
            $pDbLabel = $prev->format($phpFormat);

            $item = $rawResults->get($dbLabel);
            $income[]  = (int) ($item->income ?? 0);
            $expense[] = (int) ($item->expense ?? 0);
            $count[]   = (int) ($item->count ?? 0);
            $labels[]  = $dbLabel;

            $pItem = $prevResults->get($pDbLabel);
            $p_income[]  = (int) ($pItem->income ?? 0);
            $p_expense[] = (int) ($pItem->expense ?? 0);
            $p_count[]   = (int) ($pItem->count ?? 0);

            match ($groupBy) {
                'month' => [$curr->addMonth(), $prev->addMonth()],
                'week'  => [$curr->addWeek(),  $prev->addWeek()],
                'year'  => [$curr->addYear(),  $prev->addYear()],
                default => [$curr->addDay(),   $prev->addDay()],
            };
        }

        return [
            'income'         => $income,
            'income_labels'  => $labels,
            'expense'        => $expense,
            'expense_labels' => $labels,
            'count'          => $count,
            'count_labels'   => $labels,
            'prev_income'    => $p_income,
            'prev_expense'   => $p_expense,
            'prev_count'     => $p_count,
        ];
    }

    /**
     * Get aggregated account history data for multiple accounts.
     */
    public static function getAccountsHistory(User $user, string $groupBy = 'day', array $filters = []): array
    {
        $pgFormat = match ($groupBy) {
            'week'  => 'IYYY-"W"IW',
            'month' => 'YYYY-MM',
            'year'  => 'YYYY',
            default => 'YYYY-MM-DD',
        };
        $phpFormat = match ($groupBy) {
            'week'  => 'o-\WW',
            'month' => 'Y-m',
            'year'  => 'Y',
            default => 'Y-m-d',
        };

        if (empty($filters['date_from']) || empty($filters['date_to'])) {
            $endDate = Carbon::now()->endOfDay();
            $startDate = $endDate->copy()->subDays(29)->startOfDay();
        } else {
            $startDate = Carbon::parse($filters['date_from'])->startOfDay();
            $endDate   = Carbon::parse($filters['date_to'])->endOfDay();
        }

        match ($groupBy) {
            'week' => [$startDate->startOfWeek(), $endDate->endOfWeek()],
            'month' => [$startDate->startOfMonth(), $endDate->endOfMonth()],
            'year' => [$startDate->startOfYear(), $endDate->endOfYear()],
            default => [$startDate->startOfDay(), $endDate->endOfDay()],
        };

        $startStr = $startDate->toDateTimeString();
        $endStr = $endDate->toDateTimeString();

        [$txOut, $txIn] = TransactionRepository::getAccountsHistoryData($user, $pgFormat, $startStr, $endStr);
        $initialBalances = TransactionRepository::getInitialBalances($user, $startStr);

        $labels = [];
        $curr = $startDate->copy();
        while ($curr->lte($endDate)) {
            $labels[] = $curr->format($phpFormat);
            match ($groupBy) {
                'week'  => $curr->addWeek(),
                'month' => $curr->addMonth(),
                'year'  => $curr->addYear(),
                default => $curr->addDay(),
            };
        }

        $income = $expense = [];
        foreach ($txOut as $row) {
            $aid = (int)$row->account_id;
            $income[$aid][$row->label] = ($income[$aid][$row->label] ?? 0) + (int)$row->income;
            $expense[$aid][$row->label] = ($expense[$aid][$row->label] ?? 0) + (int)$row->expense;
        }
        foreach ($txIn as $row) {
            $aid = (int)$row->account_id;
            $income[$aid][$row->label] = ($income[$aid][$row->label] ?? 0) + (int)$row->income;
        }

        return ['labels' => $labels, 'income' => $income, 'expense' => $expense, 'initial_balances' => $initialBalances];
    }

    /**
     * Build running balance history from net changes and initial balance.
     */
    public static function buildAccountHistory(int $initialBalance, array $netChanges, array $labels): array
    {
        $incomeByLabel = $netChanges['income'] ?? []; $expenseByLabel = $netChanges['expense'] ?? [];
        $balance = $income = $expense = []; $currentRunningTarget = $initialBalance;
        foreach ($labels as $label) {
            $inc = (int)($incomeByLabel[$label] ?? 0);
            $exp = (int)($expenseByLabel[$label] ?? 0);
            
            $income[] = $inc;
            $expense[] = $exp;
            
            $currentRunningTarget += ($inc - $exp);
            $balance[] = $currentRunningTarget;
        }
        return ['balance' => $balance, 'income' => $income, 'expense' => $expense];
    }
}
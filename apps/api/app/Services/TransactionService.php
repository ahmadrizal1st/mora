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
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        return TransactionRepository::list($user, $filters);
    }

    public static function store(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            $account = $user->accounts()->findOrFail($data['account_id']);

            $txData = [
                'user_id' => $user->id,
                'type' => $data['type'],
                'amount' => $data['amount'],
                'currency_id' => $data['currency_id'] ?? $account->currency_id,
                'exchange_rate' => $data['exchange_rate'] ?? 1,
                'account_id' => $data['account_id'],
                'to_account_id' => $data['to_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'budget_item_id' => $data['budget_item_id'] ?? null,
                'status_id' => $data['status_id'] ?? null,
                'recurring_type_id' => $data['recurring_type_id'] ?? null,
                'document_extraction_id' => $data['document_extraction_id'] ?? null,
                'split_bill_id' => $data['split_bill_id'] ?? null,
                'tx_date' => $data['tx_date'],
                'input_method' => $data['input_method'] ?? Transaction::METHOD_MANUAL,
                'merchant' => $data['merchant'] ?? null,
                'notes' => $data['notes'] ?? null,
                'dynamic_fields' => $data['dynamic_fields'] ?? null,
            ];

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

            $transaction = TransactionRepository::store($txData);

            if (!empty($data['tag_ids'])) {
                $validTagIds = $user->tags()->whereIn('id', $data['tag_ids'])->pluck('id');
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

    public static function show(User $user, string $id): Transaction
    {
        return TransactionRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $transaction = TransactionRepository::findForUser($user, $id);

            if (!empty($data['account_id'])) {
                $user->accounts()->findOrFail($data['account_id']);
            }
            if (!empty($data['to_account_id'])) {
                $user->accounts()->findOrFail($data['to_account_id']);
            }

            $transaction = TransactionRepository::update($transaction, $data);

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

    public static function destroy(User $user, string $id): void
    {
        DB::transaction(function () use ($user, $id) {
            $transaction = TransactionRepository::findForUser($user, $id);
            TransactionRepository::destroy($transaction);
        });
    }

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
            'total_income'      => (float) $income,
            'total_expense'     => (float) $expense,
            'net_balance'       => (float) ($income - $expense),
            'transaction_count' => $count,
            'income_trend'      => (float) $calcTrend($income, $prevIncome),
            'expense_trend'     => (float) $calcTrend($expense, $prevExpense),
            'count_trend'       => (float) $calcTrend($count, $prevCount),
            'balance_trend'     => (float) $calcTrend($income - $expense, $prevIncome - $prevExpense),
        ];
    }

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

        match ($groupBy) {
            'week'  => [$currentFrom->startOfWeek(), $currentTo->endOfWeek()],
            'month' => [$currentFrom->startOfMonth(), $currentTo->endOfMonth()],
            'year'  => [$currentFrom->startOfYear(), $currentTo->endOfYear()],
            default => [$currentFrom->startOfDay(), $currentTo->endOfDay()],
        };

        $currentFilters = array_merge($baseFilters, [
            'date_from' => $currentFrom->toDateTimeString(),
            'date_to'   => $currentTo->toDateTimeString(),
        ]);
        $rawResults = TransactionRepository::fetchHistoryRows($user, $pgFormat, $currentFilters)->keyBy('label');

        $income = [];
        $expense = [];
        $count = [];
        $labels = [];

        $curr = $currentFrom->copy();

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

            $item = $rawResults->get($dbLabel);
            $income[]  = (float) ($item->income ?? 0);
            $expense[] = (float) ($item->expense ?? 0);
            $count[]   = (int) ($item->count ?? 0);
            $labels[]  = $dbLabel;

            match ($groupBy) {
                'month' => $curr->addMonth(),
                'week'  => $curr->addWeek(),
                'year'  => $curr->addYear(),
                default => $curr->addDay(),
            };
        }

        return [
            'income'         => $income,
            'income_labels'  => $labels,
            'expense'        => $expense,
            'expense_labels' => $labels,
            'count'          => $count,
            'count_labels'   => $labels,
        ];
    }

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
            $endDate = Carbon::parse($filters['date_to'])->endOfDay();
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
            $aid = (string)$row->account_id;
            $income[$aid][$row->label] = ($income[$aid][$row->label] ?? 0) + (float)$row->income;
            $expense[$aid][$row->label] = ($expense[$aid][$row->label] ?? 0) + (float)$row->expense;
        }
        foreach ($txIn as $row) {
            $aid = (string)$row->account_id;
            $income[$aid][$row->label] = ($income[$aid][$row->label] ?? 0) + (float)$row->income;
        }

        return ['labels' => $labels, 'income' => $income, 'expense' => $expense, 'initial_balances' => $initialBalances];
    }

    public static function buildAccountHistory(int $initialBalance, array $netChanges, array $labels): array
    {
        $incomeByLabel = $netChanges['income'] ?? [];
        $expenseByLabel = $netChanges['expense'] ?? [];
        $balance = $income = $expense = [];
        $currentRunningTarget = $initialBalance;
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

    public static function statistics(User $user): array
    {
        $stats = TransactionRepository::getCategoryStatistics($user);
        
        $statSeries = $stats->map(function ($st) {
            return [
                'name' => $st->category ? $st->category->name : 'Uncategorized',
                'data' => [(float)$st->total],
                'color' => $st->category ? $st->category->color : 'gray',
            ];
        })->values()->toArray();

        return [
            'total' => $stats->sum('total'),
            'series' => $statSeries
        ];
    }
}

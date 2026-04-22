<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    /**
     * List transactions for a user with filters and pagination.
     */
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->transactions()
            ->with(['account', 'toAccount', 'category', 'status', 'currency', 'recurringType', 'tags']);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['account_id'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('account_id', $filters['account_id'])
                    ->orWhere('to_account_id', $filters['account_id']);
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('tx_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('tx_date', '<=', $filters['date_to']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('merchant', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['tag_ids'])) {
            $tagIds = is_array($filters['tag_ids']) ? $filters['tag_ids'] : explode(',', $filters['tag_ids']);
            foreach ($tagIds as $tagId) {
                $query->whereHas('tags', function ($q) use ($tagId) {
                    $q->where('tags.id', $tagId);
                });
            }
        }

        $sortBy = $filters['sort_by'] ?? 'tx_date';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        if ($sortBy === 'nominal') {
            $query->orderBy('amount_raw', $sortDir);
        } elseif ($sortBy === 'category') {
            $query->select('transactions.*')
                ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
                ->orderBy('categories.name', $sortDir);
        } elseif ($sortBy === 'account') {
            $query->select('transactions.*')
                ->leftJoin('accounts', 'transactions.account_id', '=', 'accounts.id')
                ->orderBy('accounts.name', $sortDir);
        } else {
            $allowedColumns = ['tx_date', 'merchant', 'created_at', 'type'];
            $sortBy = in_array($sortBy, $allowedColumns) ? $sortBy : 'tx_date';
            $query->orderBy($sortBy, $sortDir);
        }

        $perPage = min($filters['per_page'] ?? 15, 100);

        return $query->paginate($perPage);
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
                'status_id' => $data['status_id'] ?? null,
                'recurring_type_id' => $data['recurring_type_id'] ?? null,
                'tx_date' => $data['tx_date'],
                'merchant' => $data['merchant'] ?? null,
                'notes' => $data['notes'] ?? null,
                'dynamic_fields' => $data['dynamic_fields'] ?? null,
            ];

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
            ->with(['account', 'toAccount', 'category', 'status', 'currency', 'recurringType', 'tags'])
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

        $dateFrom = $dateFromRaw ? \Carbon\Carbon::parse($dateFromRaw)->startOfDay() : null;
        $dateTo   = $dateToRaw   ? \Carbon\Carbon::parse($dateToRaw)->endOfDay()     : null;

        $currentFilters = array_merge($filters, [
            'date_from' => $dateFrom ? $dateFrom->toDateTimeString() : null,
            'date_to'   => $dateTo   ? $dateTo->toDateTimeString()   : null,
        ]);

        [$income, $expense, $count] = self::calcSummaryTotals($user, $currentFilters);

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

            [$prevIncome, $prevExpense, $prevCount] = self::calcSummaryTotals($user, $prevFilters);
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

    private static function calcSummaryTotals(User $user, array $filters): array
    {
        $accountId = $filters['account_id'] ?? null;
        $dateFrom  = $filters['date_from']  ?? null;
        $dateTo    = $filters['date_to']    ?? null;

        $base = $user->transactions()
            ->whereIn('type', [Transaction::TYPE_INCOME, Transaction::TYPE_EXPENSE]);

        if ($accountId) $base->where('account_id', $accountId);
        if ($dateFrom)  $base->where('tx_date', '>=', $dateFrom);
        if ($dateTo)    $base->where('tx_date', '<=', $dateTo);

        $income  = (int) (clone $base)->where('type', Transaction::TYPE_INCOME)->sum('amount_raw');
        $expense = (int) (clone $base)->where('type', Transaction::TYPE_EXPENSE)->sum('amount_raw');
        $count   = (clone $base)->count();

        if ($accountId) {
            $transferOutQ = $user->transactions()
                ->where('type', Transaction::TYPE_TRANSFER)
                ->where('account_id', $accountId);
            if ($dateFrom) $transferOutQ->where('tx_date', '>=', $dateFrom);
            if ($dateTo)   $transferOutQ->where('tx_date', '<=', $dateTo);
            $expense += (int) $transferOutQ->sum('amount_raw');
            $count   += $transferOutQ->count();

            $transferInQ = $user->transactions()
                ->where('type', Transaction::TYPE_TRANSFER)
                ->where('to_account_id', $accountId);
            if ($dateFrom) $transferInQ->where('tx_date', '>=', $dateFrom);
            if ($dateTo)   $transferInQ->where('tx_date', '<=', $dateTo);
            $income += (int) $transferInQ->sum('amount_raw');
            $count  += $transferInQ->count();
        }

        return [$income, $expense, $count];
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
            $rangeQuery = $user->transactions();
            if (!empty($baseFilters['account_id'])) {
                $rangeQuery->where(function ($q) use ($baseFilters) {
                    $q->where('account_id', $baseFilters['account_id'])
                        ->orWhere('to_account_id', $baseFilters['account_id']);
                });
            }
            $range = $rangeQuery->selectRaw('MIN(tx_date) as start_date')->first();

            $currentFrom = $range && $range->start_date
                ? \Carbon\Carbon::parse($range->start_date)
                : \Carbon\Carbon::now()->subDays(29);
            $currentTo = \Carbon\Carbon::now();
        } else {
            $currentFrom = \Carbon\Carbon::parse($baseFilters['date_from']);
            $currentTo   = \Carbon\Carbon::parse($baseFilters['date_to']);
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
        $rawResults = self::fetchHistoryRows($user, $pgFormat, $currentFilters)->keyBy('label');

        $prevFilters = array_merge($baseFilters, [
            'date_from' => $prevFrom->toDateTimeString(),
            'date_to'   => $prevTo->toDateTimeString(),
        ]);
        $prevResults = self::fetchHistoryRows($user, $pgFormat, $prevFilters)->keyBy('label');

        $income = $expense = $count = $labels = $p_income = $p_expense = $p_count = [];
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
            'income' => $income, 'income_labels' => $labels,
            'expense' => $expense, 'expense_labels' => $labels,
            'count' => $count, 'count_labels' => $labels,
            'prev_income' => $p_income, 'prev_expense' => $p_expense, 'prev_count' => $p_count,
        ];
    }

    private static function fetchHistoryRows(User $user, string $pgFormat, array $filters): \Illuminate\Support\Collection
    {
        $accountId = $filters['account_id'] ?? null;
        $dateFrom  = $filters['date_from']  ?? null;
        $dateTo    = $filters['date_to']    ?? null;

        $dateWhere = '';
        if ($dateFrom) $dateWhere .= ' AND tx_date >= ' . DB::getPdo()->quote($dateFrom);
        if ($dateTo)   $dateWhere .= ' AND tx_date <= ' . DB::getPdo()->quote($dateTo);

        if ($accountId) {
            $pgFormat_q = DB::getPdo()->quote($pgFormat);
            $uid = (int) $user->id;
            $aid = (int) $accountId;

            $outSql = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(CASE WHEN type='income' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type IN ('expense','transfer') THEN amount_raw ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND account_id={$aid} AND type IN ('income','expense','transfer') {$dateWhere} GROUP BY label";
            $inSql  = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(amount_raw) AS income, 0 AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND to_account_id={$aid} AND type='transfer' {$dateWhere} GROUP BY label";
            $sql = "SELECT label, SUM(income) AS income, SUM(expense) AS expense, SUM(count) AS count FROM (({$outSql}) UNION ALL ({$inSql})) AS combined GROUP BY label ORDER BY label ASC";
            return collect(DB::select($sql));
        }

        $pgFormat_q = DB::getPdo()->quote($pgFormat);
        $uid = (int) $user->id;
        $sql = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(CASE WHEN type='income' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type='expense' THEN amount_raw ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND type IN ('income','expense') {$dateWhere} GROUP BY label ORDER BY label ASC";
        return collect(DB::select($sql));
    }

    public static function getAccountsHistory(User $user, string $groupBy = 'day', array $filters = []): array
    {
        $pgFormat = match ($groupBy) {
            'week' => 'IYYY-"W"IW', 'month' => 'YYYY-MM', 'year' => 'YYYY', default => 'YYYY-MM-DD',
        };
        $phpFormat = match ($groupBy) {
            'week' => 'o-\WW', 'month' => 'Y-m', 'year' => 'Y', default => 'Y-m-d',
        };

        if (empty($filters['date_from']) || empty($filters['date_to'])) {
            $range = $user->transactions()->selectRaw('MIN(tx_date) as start_date')->first();
            $startDate = $range?->start_date 
                ? \Carbon\Carbon::parse($range->start_date) 
                : \Carbon\Carbon::now()->subDays(29);
            $endDate = \Carbon\Carbon::now();
        } else {
            $startDate = \Carbon\Carbon::parse($filters['date_from']);
            $endDate   = \Carbon\Carbon::parse($filters['date_to']);
        }

        match ($groupBy) {
            'week' => [$startDate->startOfWeek(), $endDate->endOfWeek()],
            'month' => [$startDate->startOfMonth(), $endDate->endOfMonth()],
            'year' => [$startDate->startOfYear(), $endDate->endOfYear()],
            default => [$startDate->startOfDay(), $endDate->endOfDay()],
        };

        $startStr = $startDate->toDateTimeString();
        $endStr = $endDate->toDateTimeString();

        $txOut = DB::select("SELECT account_id, to_char(tx_date, ?) AS label, SUM(CASE WHEN type='income' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type IN ('expense','transfer') THEN amount_raw ELSE 0 END) AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type IN ('income','expense','transfer') GROUP BY account_id, label ORDER BY account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);
        $txIn = DB::select("SELECT to_account_id AS account_id, to_char(tx_date, ?) AS label, SUM(amount_raw) AS income, 0 AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type='transfer' AND to_account_id IS NOT NULL GROUP BY to_account_id, label ORDER BY to_account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);

        $initialBalances = [];
        $balanceOut = DB::select("SELECT account_id, SUM(CASE WHEN type='income' THEN amount_raw ELSE 0 END) AS inc, SUM(CASE WHEN type IN ('expense','transfer') THEN amount_raw ELSE 0 END) AS exp FROM transactions WHERE user_id=? AND tx_date<? AND type IN ('income','expense','transfer') GROUP BY account_id", [$user->id, $startStr]);
        foreach ($balanceOut as $row) $initialBalances[$row->account_id] = (int)$row->inc - (int)$row->exp;
        $balanceIn = DB::select("SELECT to_account_id AS account_id, SUM(amount_raw) AS inc FROM transactions WHERE user_id=? AND tx_date<? AND type='transfer' AND to_account_id IS NOT NULL GROUP BY to_account_id", [$user->id, $startStr]);
        foreach ($balanceIn as $row) $initialBalances[$row->account_id] = ($initialBalances[$row->account_id] ?? 0) + (int)$row->inc;

        $labels = []; $curr = $startDate->copy();
        while ($curr->lte($endDate)) {
            $labels[] = $curr->format($phpFormat);
            match ($groupBy) { 'week' => $curr->addWeek(), 'month' => $curr->addMonth(), 'year' => $curr->addYear(), default => $curr->addDay() };
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

    public static function buildAccountHistory(int $initialBalance, array $netChanges, array $labels): array
    {
        $incomeByLabel = $netChanges['income'] ?? []; $expenseByLabel = $netChanges['expense'] ?? [];
        $balance = $income = $expense = []; $currentRunningTarget = $initialBalance;
        foreach ($labels as $label) {
            $inc = (int)($incomeByLabel[$label] ?? 0); $exp = (int)($expenseByLabel[$label] ?? 0);
            $income[] = $inc; $expense[] = $exp;
            $currentRunningTarget += ($inc - $exp); $balance[] = $currentRunningTarget;
        }
        return ['balance' => $balance, 'income' => $income, 'expense' => $expense];
    }
}
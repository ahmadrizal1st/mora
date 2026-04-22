<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TransactionRepository
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
     * Get summary totals for a period.
     */
    public static function getSummaryTotals(User $user, array $filters): array
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

    /**
     * Fetch historical rows for charting.
     */
    public static function fetchHistoryRows(User $user, string $pgFormat, array $filters): Collection
    {
        $accountId = $filters['account_id'] ?? null;
        $dateFrom  = $filters['date_from']  ?? null;
        $dateTo    = $filters['date_to']    ?? null;

        $dateWhere = '';
        if ($dateFrom) $dateWhere .= ' AND tx_date >= ' . DB::getPdo()->quote($dateFrom);
        if ($dateTo)   $dateWhere .= ' AND tx_date <= ' . DB::getPdo()->quote($dateTo);

        $pgFormat_q = DB::getPdo()->quote($pgFormat);
        $uid = (int) $user->id;

        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        if ($accountId) {
            $aid = (int) $accountId;
            $outSql = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount_raw ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND account_id={$aid} AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') {$dateWhere} GROUP BY label";
            $inSql  = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(amount_raw) AS income, 0 AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND to_account_id={$aid} AND type='{$tTransfer}' {$dateWhere} GROUP BY label";
            $sql = "SELECT label, SUM(income) AS income, SUM(expense) AS expense, SUM(count) AS count FROM (({$outSql}) UNION ALL ({$inSql})) AS combined GROUP BY label ORDER BY label ASC";
            return collect(DB::select($sql));
        }

        $sql = "SELECT to_char(tx_date, {$pgFormat_q}) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type='{$tExpense}' THEN amount_raw ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id={$uid} AND type IN ('{$tIncome}','{$tExpense}') {$dateWhere} GROUP BY label ORDER BY label ASC";
        return collect(DB::select($sql));
    }

    /**
     * Get aggregated account history data for multiple accounts.
     */
    public static function getAccountsHistoryData(User $user, string $pgFormat, string $startStr, string $endStr): array
    {
        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        $txOut = DB::select("SELECT account_id, to_char(tx_date, ?) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount_raw ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount_raw ELSE 0 END) AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') GROUP BY account_id, label ORDER BY account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);
        
        $txIn = DB::select("SELECT to_account_id AS account_id, to_char(tx_date, ?) AS label, SUM(amount_raw) AS income, 0 AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type='{$tTransfer}' AND to_account_id IS NOT NULL GROUP BY to_account_id, label ORDER BY to_account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);

        return [$txOut, $txIn];
    }

    /**
     * Get initial balances for all accounts before a certain date.
     */
    public static function getInitialBalances(User $user, string $startStr): array
    {
        $initialBalances = [];
        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;
        
        $balanceOut = DB::select("SELECT account_id, SUM(CASE WHEN type='{$tIncome}' THEN amount_raw ELSE 0 END) AS inc, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount_raw ELSE 0 END) AS exp FROM transactions WHERE user_id=? AND tx_date<? AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') GROUP BY account_id", [$user->id, $startStr]);
        
        foreach ($balanceOut as $row) {
            $initialBalances[$row->account_id] = (int)$row->inc - (int)$row->exp;
        }
        
        $balanceIn = DB::select("SELECT to_account_id AS account_id, SUM(amount_raw) AS inc FROM transactions WHERE user_id=? AND tx_date<? AND type='{$tTransfer}' AND to_account_id IS NOT NULL GROUP BY to_account_id", [$user->id, $startStr]);
        
        foreach ($balanceIn as $row) {
            $initialBalances[$row->account_id] = ($initialBalances[$row->account_id] ?? 0) + (int)$row->inc;
        }

        return $initialBalances;
    }

    /**
     * Get the earliest transaction date for a user.
     */
    public static function getEarliestTransactionDate(User $user, ?int $accountId = null): ?string
    {
        $query = $user->transactions();
        
        if ($accountId) {
            $query->where(function ($q) use ($accountId) {
                $q->where('account_id', $accountId)
                    ->orWhere('to_account_id', $accountId);
            });
        }

        return $query->min('tx_date');
    }
}

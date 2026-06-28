<?php

namespace App\Repositories;

use App\Models\Account;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AccountRepository
{
    public static function queryForUser(User $user): QueryBuilder
    {
        return QueryBuilder::for(Account::class)
            ->where('user_id', $user->id)
            ->allowedFilters(
                AllowedFilter::partial('name'),
                'account_type',
                'currency_id',
                AllowedFilter::exact('is_archived')->default(false)
            )
            ->allowedSorts('name', 'account_type', 'created_at')
            ->with(['currency', 'provider'])
            ->withCount(['transactions', 'incomingTransfers']);
    }

    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('name')
            ->get();
    }

    public static function findForUser(User $user, string $id): Account
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }

    public static function hasTransactions(Account $account): bool
    {
        return $account->transactions()->exists() || $account->incomingTransfers()->exists();
    }

    public static function getBalances(User $user): array
    {
        $tIncome = \App\Models\Transaction::TYPE_INCOME;
        $tExpense = \App\Models\Transaction::TYPE_EXPENSE;
        $tTransfer = \App\Models\Transaction::TYPE_TRANSFER;

        $balances = [];

        $out = \Illuminate\Support\Facades\DB::select("
            SELECT account_id, 
                   SUM(CASE WHEN type = '{$tIncome}' THEN amount ELSE 0 END) - 
                   SUM(CASE WHEN type IN ('{$tExpense}', '{$tTransfer}') THEN amount ELSE 0 END) as net
            FROM transactions 
            WHERE user_id = ? 
            GROUP BY account_id
        ", [$user->id]);

        foreach ($out as $row) {
            $balances[(string)$row->account_id] = (float) $row->net;
        }

        $in = \Illuminate\Support\Facades\DB::select("
            SELECT to_account_id as account_id, 
                   SUM(amount) as net
            FROM transactions 
            WHERE user_id = ? AND type = '{$tTransfer}' AND to_account_id IS NOT NULL
            GROUP BY to_account_id
        ", [$user->id]);

        foreach ($in as $row) {
            $aid = (string)$row->account_id;
            $balances[$aid] = ($balances[$aid] ?? 0) + (float) $row->net;
        }

        return $balances;
    }

    public static function getAnalyticsQuery(User $user, ?string $accountId, int $month, int $year)
    {
        $query = $user->transactions()
            ->whereMonth('tx_date', $month)
            ->whereYear('tx_date', $year);

        if ($accountId) {
            $query->where('account_id', $accountId);
        }

        return $query;
    }

    public static function getTopMerchants($query, int $limit = 5): \Illuminate\Support\Collection
    {
        return (clone $query)
            ->where('type', \App\Models\Transaction::TYPE_EXPENSE)
            ->whereNotNull('merchant')
            ->selectRaw('merchant as name, count(*) as count, sum(amount) as amount, MAX(CAST(category_id AS varchar)) as category_id')
            ->groupBy('merchant')
            ->orderByDesc('amount')
            ->limit($limit)
            ->with('category')
            ->get();
    }

    public static function getExpensesByCategory($query): \Illuminate\Support\Collection
    {
        return (clone $query)
            ->where('type', \App\Models\Transaction::TYPE_EXPENSE)
            ->selectRaw('category_id, sum(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->orderByDesc('total')
            ->get();
    }

    public static function getRecentTransactions($query, int $limit = 10): \Illuminate\Support\Collection
    {
        return (clone $query)
            ->with(['category', 'account'])
            ->orderByDesc('tx_date')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public static function getTotalExpense($query): float
    {
        return (float)(clone $query)->where('type', \App\Models\Transaction::TYPE_EXPENSE)->sum('amount');
    }

    public static function getTotalIncome($query): float
    {
        return (float)(clone $query)->where('type', \App\Models\Transaction::TYPE_INCOME)->sum('amount');
    }

    public static function getTransactionCount($query): int
    {
        return (clone $query)->count();
    }

    public static function getMostExpensiveDay($query): ?object
    {
        return (clone $query)
            ->where('type', \App\Models\Transaction::TYPE_EXPENSE)
            ->selectRaw('tx_date, sum(amount) as total')
            ->groupBy('tx_date')
            ->orderByDesc('total')
            ->first();
    }
}

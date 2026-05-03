<?php

namespace App\Repositories;

use App\Models\Account;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AccountRepository
{
    /**
     * Get a base query builder for accounts for a specific user.
     */
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

    /**
     * Get all accounts for a user with basic relationships.
     */
    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('name')
            ->get();
    }

    /**
     * Find a specific account for a user.
     */
    public static function findForUser(User $user, string $id): Account
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }

    /**
     * Check if an account has any transactions or incoming transfers.
     */
    public static function hasTransactions(Account $account): bool
    {
        return $account->transactions()->exists() || $account->incomingTransfers()->exists();
    }

    /**
     * Get the current absolute balance for all accounts of a user.
     */
    public static function getBalances(User $user): array
    {
        $tIncome = \App\Models\Transaction::TYPE_INCOME;
        $tExpense = \App\Models\Transaction::TYPE_EXPENSE;
        $tTransfer = \App\Models\Transaction::TYPE_TRANSFER;

        $balances = [];

        // Outgoing/Direct
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

        // Incoming Transfers
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
}

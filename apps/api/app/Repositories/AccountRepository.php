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
                'type',
                'currency_id'
            )
            ->allowedSorts('name', 'type', 'created_at')
            ->with(['currency'])
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
    public static function findForUser(User $user, int $id): Account
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
}

<?php

namespace App\Repositories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AccountRepository
{
    /**
     * Get all accounts for a user with basic relationships.
     */
    public static function getAllForUser(User $user): Collection
    {
        return $user->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Find a specific account for a user.
     */
    public static function findForUser(User $user, int $id): Account
    {
        return $user->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
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

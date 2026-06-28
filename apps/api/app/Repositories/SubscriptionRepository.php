<?php

namespace App\Repositories;

use App\Models\Subscription;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SubscriptionRepository
{
    public static function queryForUser(User $user): QueryBuilder
    {
        return QueryBuilder::for(Subscription::class)
            ->where('user_id', $user->id)
            ->allowedFilters('status', 'billing_cycle')
            ->allowedSorts('next_billing_date', 'amount', 'created_at')
            ->with(['currency', 'account']);
    }

    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('next_billing_date')
            ->get();
    }

    public static function findForUser(User $user, string $id): Subscription
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }
}

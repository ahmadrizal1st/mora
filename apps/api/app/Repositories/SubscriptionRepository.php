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

    public static function store(User $user, array $data): Subscription
    {
        if (empty($data['currency_id'])) {
            $currency = \App\Models\Currency::where('code', 'IDR')->first() ?? \App\Models\Currency::first();
            $data['currency_id'] = $currency ? $currency->id : null;
        }
        if (empty($data['account_id'])) {
            $account = $user->accounts()->first();
            $data['account_id'] = $account ? $account->id : null;
        }
        return $user->subscriptions()->create($data)->load(['currency', 'account']);
    }

    public static function update(Subscription $subscription, array $data): Subscription
    {
        $subscription->update($data);
        return $subscription->fresh()->load(['currency', 'account']);
    }

    public static function destroy(Subscription $subscription): void
    {
        $subscription->delete();
    }
}

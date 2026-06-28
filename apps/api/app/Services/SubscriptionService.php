<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use App\Repositories\SubscriptionRepository;

class SubscriptionService
{
    public static function list(User $user)
    {
        return SubscriptionRepository::getAllForUser($user);
    }

    public static function store(User $user, array $data): Subscription
    {
        return $user->subscriptions()->create($data)->load(['currency', 'account']);
    }

    public static function show(User $user, string $id): Subscription
    {
        return SubscriptionRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Subscription
    {
        $subscription = SubscriptionRepository::findForUser($user, $id);
        $subscription->update($data);
        return $subscription->fresh()->load(['currency', 'account']);
    }

    public static function destroy(User $user, string $id): void
    {
        $subscription = SubscriptionRepository::findForUser($user, $id);
        $subscription->delete();
    }
}

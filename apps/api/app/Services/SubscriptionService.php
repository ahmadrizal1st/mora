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
        return SubscriptionRepository::store($user, $data);
    }

    public static function show(User $user, string $id): Subscription
    {
        return SubscriptionRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Subscription
    {
        $subscription = SubscriptionRepository::findForUser($user, $id);
        return SubscriptionRepository::update($subscription, $data);
    }

    public static function destroy(User $user, string $id): void
    {
        $subscription = SubscriptionRepository::findForUser($user, $id);
        SubscriptionRepository::destroy($subscription);
    }
}

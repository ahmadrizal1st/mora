<?php

namespace App\Services;

use App\Models\Goal;
use App\Models\User;
use App\Repositories\GoalRepository;

class GoalService
{
    public static function list(User $user)
    {
        return GoalRepository::getAllForUser($user);
    }

    public static function store(User $user, array $data): Goal
    {
        return $user->goals()->create($data)->load(['currency', 'linkedAccount']);
    }

    public static function show(User $user, string $id): Goal
    {
        return GoalRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Goal
    {
        $goal = GoalRepository::findForUser($user, $id);
        $goal->update($data);
        return $goal->fresh()->load(['currency', 'linkedAccount']);
    }

    public static function destroy(User $user, string $id): void
    {
        $goal = GoalRepository::findForUser($user, $id);
        $goal->delete();
    }
}

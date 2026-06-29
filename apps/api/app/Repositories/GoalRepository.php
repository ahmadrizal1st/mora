<?php

namespace App\Repositories;

use App\Models\Goal;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class GoalRepository
{
    public static function queryForUser(User $user): QueryBuilder
    {
        return QueryBuilder::for(Goal::class)
            ->where('user_id', $user->id)
            ->allowedFilters('type')
            ->allowedSorts('deadline_date', 'target_amount', 'created_at')
            ->with(['currency', 'linkedAccount']);
    }

    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('-created_at')
            ->get();
    }

    public static function findForUser(User $user, string $id): Goal
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }

    public static function store(User $user, array $data): Goal
    {
        if (empty($data['currency_id'])) {
            $currency = \App\Models\Currency::where('code', 'IDR')->first() ?? \App\Models\Currency::first();
            $data['currency_id'] = $currency ? $currency->id : null;
        }
        return $user->goals()->create($data)->load(['currency', 'linkedAccount']);
    }

    public static function update(Goal $goal, array $data): Goal
    {
        $goal->update($data);
        return $goal->fresh()->load(['currency', 'linkedAccount']);
    }

    public static function destroy(Goal $goal): void
    {
        $goal->delete();
    }
}

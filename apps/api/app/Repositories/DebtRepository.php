<?php

namespace App\Repositories;

use App\Models\Debt;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DebtRepository
{
    public static function queryForUser(User $user): QueryBuilder
    {
        return QueryBuilder::for(Debt::class)
            ->where('user_id', $user->id)
            ->allowedFilters('type', 'status', 'priority')
            ->allowedSorts('due_date', 'amount', 'created_at');
    }

    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('-due_date')
            ->get();
    }

    public static function findForUser(User $user, string $id): Debt
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }

    public static function store(User $user, array $data): Debt
    {
        return $user->debts()->create($data);
    }

    public static function update(Debt $debt, array $data): Debt
    {
        $debt->update($data);
        return $debt->fresh();
    }

    public static function destroy(Debt $debt): void
    {
        $debt->delete();
    }
}

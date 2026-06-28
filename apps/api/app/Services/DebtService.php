<?php

namespace App\Services;

use App\Models\Debt;
use App\Models\User;
use App\Repositories\DebtRepository;

class DebtService
{
    public static function list(User $user)
    {
        return DebtRepository::getAllForUser($user);
    }

    public static function store(User $user, array $data): Debt
    {
        return $user->debts()->create($data);
    }

    public static function show(User $user, string $id): Debt
    {
        return DebtRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Debt
    {
        $debt = DebtRepository::findForUser($user, $id);
        $debt->update($data);
        return $debt->fresh();
    }

    public static function destroy(User $user, string $id): void
    {
        $debt = DebtRepository::findForUser($user, $id);
        $debt->delete();
    }
}

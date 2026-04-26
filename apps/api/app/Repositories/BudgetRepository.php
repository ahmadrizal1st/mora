<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\BudgetPlan;
use Illuminate\Database\Eloquent\Collection;

class BudgetRepository
{
    public static function list(User $user): Collection
    {
        return BudgetPlan::where('user_id', $user->id)
            ->with(['items.categories'])
            ->get();
    }

    public static function findActive(User $user): ?BudgetPlan
    {
        return BudgetPlan::where('user_id', $user->id)
            ->where('is_active', true)
            ->with(['items.categories'])
            ->first();
    }

    public static function findById(int $id): ?BudgetPlan
    {
        return BudgetPlan::with(['items.categories'])->find($id);
    }
}

<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditRepository
{
    /**
     * List all accounts that have credit info.
     */
    public static function list(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->accounts()
            ->has('credit')
            ->with(['credit', 'currency'])
            ->paginate($perPage);
    }
}

<?php

namespace App\Services;

use App\Models\Credit;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditService
{
    /**
     * List all credit accounts for the user.
     */
    public static function list(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->accounts()
            ->has('credit')
            ->with(['credit', 'currency'])
            ->paginate($perPage);
    }

    /**
     * Upsert credit info for a specific account.
     */
    public static function upsert(User $user, int $accountId, array $data): Credit
    {
        $account = $user->accounts()->findOrFail($accountId);

        return $account->credit()->updateOrCreate(
            ['account_id' => $account->id],
            $data
        );
    }

    /**
     * Remove credit profile from an account.
     */
    public static function destroy(User $user, int $accountId): void
    {
        $account = $user->accounts()->findOrFail($accountId);
        $account->credit()->delete();
    }
}

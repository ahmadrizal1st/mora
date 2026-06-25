<?php

namespace App\Services;

use App\Models\CreditAccount;
use App\Models\User;
use App\Repositories\CreditRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditService
{
    /**
     * List all credit accounts for the user.
     */
    public static function list(User $user, int $perPage = 15, ?string $type = null): LengthAwarePaginator
    {
        return CreditRepository::list($user, $perPage, $type);
    }

    /**
     * Upsert credit info for a specific account.
     */
    public static function upsert(User $user, string $accountId, array $data): CreditAccount
    {
        $account = $user->accounts()->findOrFail($accountId);

        return CreditAccount::updateOrCreate(
            ['account_id' => $account->id, 'user_id' => $user->id],
            $data
        );
    }

    /**
     * Remove credit profile from an account.
     */
    public static function destroy(User $user, string $accountId): void
    {
        $account = $user->accounts()->findOrFail($accountId);
        $account->credit()->delete();
    }
}

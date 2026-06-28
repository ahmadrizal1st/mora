<?php

namespace App\Services;

use App\Models\CreditAccount;
use App\Models\User;
use App\Repositories\CreditRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditService
{
    
    public static function list(User $user, int $perPage = 15, ?string $type = null): LengthAwarePaginator
    {
        return CreditRepository::list($user, $perPage, $type);
    }

    
    public static function upsert(User $user, string $accountId, array $data): CreditAccount
    {
        $account = $user->accounts()->findOrFail($accountId);

        return CreditAccount::updateOrCreate(
            ['account_id' => $account->id, 'user_id' => $user->id],
            $data
        );
    }

    
    public static function destroy(User $user, string $accountId): void
    {
        $account = $user->accounts()->findOrFail($accountId);
        $account->credit()->delete();
    }
}

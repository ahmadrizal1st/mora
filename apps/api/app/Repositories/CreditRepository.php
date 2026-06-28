<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditRepository
{
    
    public static function list(User $user, int $perPage = 15, ?string $type = null): LengthAwarePaginator
    {
        $query = $user->accounts()
            ->whereHas('credit', function ($q) use ($type) {
                if ($type) {
                    $q->where('type', $type);
                }
            })
            ->with(['credit.schedules', 'currency']);
            
        return $query->paginate($perPage);
    }
}

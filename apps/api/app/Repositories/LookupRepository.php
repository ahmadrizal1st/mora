<?php

namespace App\Repositories;

use App\Models\Currency;
use App\Models\RecurringType;
use App\Models\Status;
use Illuminate\Database\Eloquent\Collection;

class LookupRepository
{
    /**
     * Get all active currencies.
     */
    public static function activeCurrencies(): Collection
    {
        return Currency::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get();
    }

    /**
     * Get all statuses.
     */
    public static function allStatuses(): Collection
    {
        return Status::all();
    }

    /**
     * Get all recurring types.
     */
    public static function allRecurringTypes(): Collection
    {
        return RecurringType::all();
    }
}

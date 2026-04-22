<?php

namespace App\Services;

use App\Models\Currency;
use App\Models\RecurringType;
use App\Models\Status;
use Illuminate\Database\Eloquent\Collection;

class LookupService
{
    /**
     * List all active currencies.
     */
    public static function currencies(): Collection
    {
        return Currency::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get();
    }

    /**
     * List all statuses.
     */
    public static function statuses(): Collection
    {
        return Status::all();
    }

    /**
     * List all recurring types.
     */
    public static function recurringTypes(): Collection
    {
        return RecurringType::all();
    }
}

<?php

namespace App\Services;

use App\Repositories\LookupRepository;
use Illuminate\Database\Eloquent\Collection;

class LookupService
{
    /**
     * List all active currencies.
     */
    public static function currencies(): Collection
    {
        return LookupRepository::activeCurrencies();
    }

    /**
     * List all statuses.
     */
    public static function statuses(): Collection
    {
        return LookupRepository::allStatuses();
    }

    /**
     * List all recurring types.
     */
    public static function recurringTypes(): Collection
    {
        return LookupRepository::allRecurringTypes();
    }
}

<?php

namespace App\Services;

use App\Repositories\LookupRepository;
use Illuminate\Database\Eloquent\Collection;

class LookupService
{
    
    public static function currencies(): Collection
    {
        return LookupRepository::activeCurrencies();
    }

    
    public static function statuses(): Collection
    {
        return LookupRepository::allStatuses();
    }

    
    public static function recurringTypes(): Collection
    {
        return LookupRepository::allRecurringTypes();
    }
}

<?php

namespace App\Repositories;

use App\Models\Currency;
use App\Models\RecurringType;
use App\Models\Status;
use Illuminate\Database\Eloquent\Collection;

class LookupRepository
{
    
    public static function activeCurrencies(): Collection
    {
        return Currency::orderBy('code')
            ->get();
    }

    
    public static function allStatuses(): Collection
    {
        return Status::all();
    }

    
    public static function allRecurringTypes(): Collection
    {
        return RecurringType::all();
    }
}

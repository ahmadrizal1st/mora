<?php

namespace App\Http\Controllers;

use App\Data\CurrencyData;
use App\Data\StatusData;
use App\Data\RecurringTypeData;
use App\Services\LookupService;
use Spatie\LaravelData\DataCollection;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    
    public function currencies(): JsonResponse
    {
        return response()->json([
            'data' => CurrencyData::collect(LookupService::currencies(), DataCollection::class),
        ]);
    }

    
    public function statuses(): JsonResponse
    {
        return response()->json([
            'data' => StatusData::collect(LookupService::statuses(), DataCollection::class),
        ]);
    }

    
    public function recurringTypes(): JsonResponse
    {
        return response()->json([
            'data' => RecurringTypeData::collect(LookupService::recurringTypes(), DataCollection::class),
        ]);
    }
}

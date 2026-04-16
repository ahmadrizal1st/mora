<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\RecurringType;
use App\Models\Status;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    /**
     * List all active currencies.
     *
     * GET /api/currencies
     */
    public function currencies(): JsonResponse
    {
        $currencies = Currency::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get();

        return response()->json([
            'data' => $currencies,
        ]);
    }

    /**
     * List all statuses.
     *
     * GET /api/statuses
     */
    public function statuses(): JsonResponse
    {
        return response()->json([
            'data' => Status::all(),
        ]);
    }

    /**
     * List all recurring types.
     *
     * GET /api/recurring-types
     */
    public function recurringTypes(): JsonResponse
    {
        return response()->json([
            'data' => RecurringType::all(),
        ]);
    }
}

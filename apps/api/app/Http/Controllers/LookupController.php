<?php

namespace App\Http\Controllers;

use App\Services\LookupService;
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
        return response()->json([
            'data' => LookupService::currencies(),
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
            'data' => LookupService::statuses(),
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
            'data' => LookupService::recurringTypes(),
        ]);
    }
}

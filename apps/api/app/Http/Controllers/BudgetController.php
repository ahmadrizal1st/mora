<?php

namespace App\Http\Controllers;

use App\Data\BudgetPlanData;
use App\Services\BudgetService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $plans = BudgetService::list($request->user());
        return response()->json([
            'data' => BudgetPlanData::collect($plans)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'method' => 'string|in:50_30_20,custom,zero_based',
            'income_baseline' => 'numeric',
            'duration' => 'string|in:monthly,weekly,yearly',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.name' => 'required|string',
            'items.*.percentage' => 'nullable|numeric',
            'items.*.amount_limit' => 'nullable|numeric',
            'items.*.color' => 'nullable|string',
            'items.*.icon' => 'nullable|string',
            'items.*.category_ids' => 'array',
        ]);

        $plan = BudgetService::store($request->user(), $data);
        return response()->json([
            'data' => BudgetPlanData::from($plan)
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'string',
            'method' => 'string|in:50_30_20,custom,zero_based',
            'income_baseline' => 'numeric',
            'duration' => 'string|in:monthly,weekly,yearly',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.name' => 'required|string',
            'items.*.percentage' => 'nullable|numeric',
            'items.*.amount_limit' => 'nullable|numeric',
            'items.*.color' => 'nullable|string',
            'items.*.icon' => 'nullable|string',
            'items.*.category_ids' => 'array',
        ]);

        $plan = BudgetService::update($request->user(), $id, $data);
        return response()->json([
            'data' => BudgetPlanData::from($plan)
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        BudgetService::destroy($request->user(), $id);
        return response()->json(null, 204);
    }

    public function utilization(Request $request): JsonResponse
    {
        $data = BudgetService::getUtilization($request->user(), $request->query('plan_id'));
        return response()->json(['data' => $data]);
    }
}

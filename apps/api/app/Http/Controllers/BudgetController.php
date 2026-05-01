<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
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

    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $plan = BudgetService::store($request->user(), $request->validated());
        return response()->json([
            'data' => BudgetPlanData::from($plan)
        ]);
    }

    public function update(UpdateBudgetRequest $request, string $id): JsonResponse
    {
        $plan = BudgetService::update($request->user(), $id, $request->validated());
        return response()->json([
            'data' => BudgetPlanData::from($plan)
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
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

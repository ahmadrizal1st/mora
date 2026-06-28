<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Data\GoalData;
use App\Services\GoalService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GoalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $goals = GoalService::list($request->user());
        return response()->json(['data' => GoalData::collect($goals)]);
    }

    public function store(StoreGoalRequest $request): JsonResponse
    {
        $goal = GoalService::store($request->user(), $request->validated());
        return response()->json(['data' => GoalData::from($goal)], 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $goal = GoalService::show($request->user(), $id);
        return response()->json(['data' => GoalData::from($goal)]);
    }

    public function update(UpdateGoalRequest $request, string $id): JsonResponse
    {
        $goal = GoalService::update($request->user(), $id, $request->validated());
        return response()->json(['data' => GoalData::from($goal)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        GoalService::destroy($request->user(), $id);
        return response()->json(null, 204);
    }
}

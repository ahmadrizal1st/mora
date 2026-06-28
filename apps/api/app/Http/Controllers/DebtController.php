<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDebtRequest;
use App\Http\Requests\UpdateDebtRequest;
use App\Data\DebtData;
use App\Services\DebtService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DebtController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $debts = DebtService::list($request->user());
        return response()->json(['data' => DebtData::collect($debts)]);
    }

    public function store(StoreDebtRequest $request): JsonResponse
    {
        $debt = DebtService::store($request->user(), $request->validated());
        return response()->json(['data' => DebtData::from($debt)], 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $debt = DebtService::show($request->user(), $id);
        return response()->json(['data' => DebtData::from($debt)]);
    }

    public function update(UpdateDebtRequest $request, string $id): JsonResponse
    {
        $debt = DebtService::update($request->user(), $id, $request->validated());
        return response()->json(['data' => DebtData::from($debt)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        DebtService::destroy($request->user(), $id);
        return response()->json(null, 204);
    }
}

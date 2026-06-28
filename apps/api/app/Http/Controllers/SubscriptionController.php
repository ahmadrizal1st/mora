<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use App\Data\SubscriptionData;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subscriptions = SubscriptionService::list($request->user());
        return response()->json(['data' => SubscriptionData::collect($subscriptions)]);
    }

    public function store(StoreSubscriptionRequest $request): JsonResponse
    {
        $subscription = SubscriptionService::store($request->user(), $request->validated());
        return response()->json(['data' => SubscriptionData::from($subscription)], 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $subscription = SubscriptionService::show($request->user(), $id);
        return response()->json(['data' => SubscriptionData::from($subscription)]);
    }

    public function update(UpdateSubscriptionRequest $request, string $id): JsonResponse
    {
        $subscription = SubscriptionService::update($request->user(), $id, $request->validated());
        return response()->json(['data' => SubscriptionData::from($subscription)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        SubscriptionService::destroy($request->user(), $id);
        return response()->json(null, 204);
    }
}

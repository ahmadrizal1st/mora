<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Data\AssetData;
use App\Services\AssetService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $assets = AssetService::list($request->user());
        return response()->json(['data' => AssetData::collect($assets)]);
    }

    public function store(StoreAssetRequest $request): JsonResponse
    {
        $asset = AssetService::store($request->user(), $request->validated());
        return response()->json(['data' => AssetData::from($asset)], 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $asset = AssetService::show($request->user(), $id);
        return response()->json(['data' => AssetData::from($asset)]);
    }

    public function update(UpdateAssetRequest $request, string $id): JsonResponse
    {
        $asset = AssetService::update($request->user(), $id, $request->validated());
        return response()->json(['data' => AssetData::from($asset)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        AssetService::destroy($request->user(), $id);
        return response()->json(null, 204);
    }
}

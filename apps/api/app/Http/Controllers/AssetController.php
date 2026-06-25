<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Asset;
use Illuminate\Http\JsonResponse;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $assets = $request->user()->assets()->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $assets]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'value' => 'required|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $asset = $request->user()->assets()->create($validated);
        return response()->json(['data' => $asset], 201);
    }

    public function update(Request $request, Asset $asset): JsonResponse
    {
        if ($asset->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'value' => 'sometimes|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $asset->update($validated);
        return response()->json(['data' => $asset]);
    }

    public function destroy(Request $request, Asset $asset): JsonResponse
    {
        if ($asset->user_id !== $request->user()->id) {
            abort(403);
        }

        $asset->delete();
        return response()->json(null, 204);
    }
}

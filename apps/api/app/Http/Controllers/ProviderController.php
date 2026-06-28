<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProviderRequest;
use App\Data\ProviderData;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    
    public function index(Request $request): JsonResponse
    {
        $providers = Provider::where('is_global', true)
            ->orWhere('user_id', $request->user()->id)
            ->orderBy('name')
            ->get();

        return response()->json(['data' => ProviderData::collect($providers)]);
    }

    
    public function store(StoreProviderRequest $request): JsonResponse
    {
        $provider = Provider::create([
            ...$request->validated(),
            'is_global' => false,
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => ProviderData::from($provider)], 201);
    }
}

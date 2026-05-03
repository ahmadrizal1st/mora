<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProviderController extends Controller
{
    /**
     * Display a listing of providers (global + user-specific).
     */
    public function index(Request $request): JsonResponse
    {
        $providers = Provider::where('is_global', true)
            ->orWhere('user_id', $request->user()->id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $providers
        ]);
    }

    /**
     * Store a newly created custom provider in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('providers')->where(function ($query) use ($request) {
                    return $query->where('user_id', $request->user()->id)
                                 ->orWhere('is_global', true);
                })
            ],
            'type' => ['required', Rule::in(['bank', 'ewallet', 'investment', 'other'])],
            'logo_url' => ['nullable', 'url'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $provider = Provider::create([
            ...$validated,
            'is_global' => false,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $provider
        ], 201);
    }
}

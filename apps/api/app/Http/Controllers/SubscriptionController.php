<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = $request->user()->subscriptions()->latest()->get();
        return response()->json(['data' => $subscriptions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'next_billing_date' => 'required|date',
            'status' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $subscription = $request->user()->subscriptions()->create($validated);
        return response()->json(['data' => $subscription], 201);
    }

    public function show(Request $request, string $id)
    {
        $subscription = $request->user()->subscriptions()->findOrFail($id);
        return response()->json(['data' => $subscription]);
    }

    public function update(Request $request, string $id)
    {
        $subscription = $request->user()->subscriptions()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'next_billing_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'icon' => 'sometimes|string|nullable',
            'color' => 'sometimes|string|nullable',
        ]);

        $subscription->update($validated);
        return response()->json(['data' => $subscription]);
    }

    public function destroy(Request $request, string $id)
    {
        $subscription = $request->user()->subscriptions()->findOrFail($id);
        $subscription->delete();
        return response()->json(null, 204);
    }
}

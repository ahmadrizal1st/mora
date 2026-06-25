<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = $request->user()->goals()->latest()->get();
        return response()->json(['data' => $goals]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'target_amount' => 'required|numeric',
            'current_amount' => 'nullable|numeric',
            'monthly_deposit' => 'nullable|numeric',
            'deadline_date' => 'nullable|date',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $goal = $request->user()->goals()->create($validated);
        return response()->json(['data' => $goal], 201);
    }

    public function show(Request $request, string $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        return response()->json(['data' => $goal]);
    }

    public function update(Request $request, string $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'target_amount' => 'sometimes|numeric',
            'current_amount' => 'sometimes|numeric',
            'monthly_deposit' => 'sometimes|numeric',
            'deadline_date' => 'sometimes|date',
            'icon' => 'sometimes|string|nullable',
            'color' => 'sometimes|string|nullable',
            'image_url' => 'sometimes|string|nullable',
        ]);

        $goal->update($validated);
        return response()->json(['data' => $goal]);
    }

    public function destroy(Request $request, string $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $goal->delete();
        return response()->json(null, 204);
    }
}

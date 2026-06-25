<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Http\Request;

class DebtController extends Controller
{
    public function index(Request $request)
    {
        $debts = $request->user()->debts()->latest()->get();
        return response()->json(['data' => $debts]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_name' => 'required|string',
            'type' => 'required|string|in:utang,piutang',
            'amount' => 'required|numeric',
            'amount_paid' => 'nullable|numeric',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $debt = $request->user()->debts()->create($validated);
        return response()->json(['data' => $debt], 201);
    }

    public function show(Request $request, string $id)
    {
        $debt = $request->user()->debts()->findOrFail($id);
        return response()->json(['data' => $debt]);
    }

    public function update(Request $request, string $id)
    {
        $debt = $request->user()->debts()->findOrFail($id);

        $validated = $request->validate([
            'person_name' => 'sometimes|string',
            'type' => 'sometimes|string|in:utang,piutang',
            'amount' => 'sometimes|numeric',
            'amount_paid' => 'sometimes|numeric',
            'status' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'due_date' => 'sometimes|date',
            'description' => 'sometimes|string|nullable',
        ]);

        $debt->update($validated);
        return response()->json(['data' => $debt]);
    }

    public function destroy(Request $request, string $id)
    {
        $debt = $request->user()->debts()->findOrFail($id);
        $debt->delete();
        return response()->json(null, 204);
    }
}

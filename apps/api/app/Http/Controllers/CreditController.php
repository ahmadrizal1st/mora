<?php

namespace App\Http\Controllers;

use App\Models\Credit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreditController extends Controller
{
    /**
     * List all credit accounts for the user.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        
        $credits = $request->user()->accounts()
            ->has('credit')
            ->with(['credit', 'currency'])
            ->paginate($perPage);

        return response()->json($credits);
    }

    /**
     * Upsert credit info for a specific account.
     */
    public function store(Request $request, int $accountId): JsonResponse
    {
        $account = $request->user()->accounts()->findOrFail($accountId);

        $validated = $request->validate([
            'limit' => 'required|integer|min:0',
            'total_amount' => 'nullable|integer|min:0',
            'installment_amount' => 'nullable|integer|min:0',
            'installment_type' => 'nullable|in:monthly,yearly',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $credit = $account->credit()->updateOrCreate(
            ['account_id' => $account->id],
            $validated
        );

        return response()->json([
            'message' => 'Informasi kredit berhasil diperbarui.',
            'data' => $credit,
        ]);
    }

    /**
     * Remove credit profile from an account.
     */
    public function destroy(Request $request, int $accountId): JsonResponse
    {
        $account = $request->user()->accounts()->findOrFail($accountId);
        $account->credit()->delete();

        return response()->json([
            'message' => 'Profil kredit berhasil dihapus.',
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCreditRequest;
use App\Services\CreditService;
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
        $type = $request->input('type');
        $credits = CreditService::list($request->user(), $perPage, $type);

        return response()->json([
            'data' => $credits
        ]);
    }

    /**
     * Upsert credit info for a specific account.
     */
    public function store(StoreCreditRequest $request, int $accountId): JsonResponse
    {
        $credit = CreditService::upsert(
            $request->user(),
            $accountId,
            $request->validated()
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
        CreditService::destroy($request->user(), $accountId);

        return response()->json([
            'message' => 'Profil kredit berhasil dihapus.',
        ]);
    }
}

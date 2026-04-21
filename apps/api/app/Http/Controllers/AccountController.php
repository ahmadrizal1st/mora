<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\TransactionService;

class AccountController extends Controller
{
    /**
     * List all accounts for the authenticated user.
     *
     * GET /api/accounts
     */
    public function index(Request $request): JsonResponse
    {
        $groupBy = $request->query('group_by', 'day');

        $accounts = $request->user()
            ->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
            ->orderBy('name')
            ->get();

        $accounts->each(function ($account) use ($groupBy) {
            $account->balance_history = TransactionService::getBalanceHistory($account, $groupBy);
        });

        $totalHistory = TransactionService::getTotalBalanceHistory($request->user(), $groupBy);

        return response()->json([
            'data' => $accounts,
            'summary_history' => $totalHistory['history'],
            'status' => 'success',
            'labels' => $totalHistory['labels']
        ]);
    }

    /**
     * Create a new account.
     *
     * POST /api/accounts
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = $request->user()->accounts()->create($request->validated());

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'data' => $account->load('currency'),
        ], 201);
    }

    /**
     * Show a single account.
     *
     * GET /api/accounts/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $groupBy = $request->query('group_by', 'day');

        $account = $request->user()
            ->accounts()
            ->with('currency')
            ->withCount(['transactions', 'incomingTransfers'])
            ->findOrFail($id);

        $account->balance_history = TransactionService::getBalanceHistory($account, $groupBy);

        return response()->json([
            'data' => $account,
        ]);
    }

    /**
     * Update an account.
     *
     * PUT /api/accounts/{id}
     */
    public function update(UpdateAccountRequest $request, int $id): JsonResponse
    {
        $account = $request->user()->accounts()->findOrFail($id);
        $account->update($request->validated());

        return response()->json([
            'message' => 'Akun berhasil diperbarui.',
            'data' => $account->fresh()->load('currency'),
        ]);
    }

    /**
     * Delete an account.
     *
     * DELETE /api/accounts/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $account = $request->user()->accounts()->findOrFail($id);

        // Check if account has transactions
        if ($account->transactions()->exists()) {
            return response()->json([
                'message' => 'Akun tidak bisa dihapus karena masih memiliki transaksi.',
            ], 422);
        }

        $account->delete();

        return response()->json([
            'message' => 'Akun berhasil dihapus.',
        ]);
    }
}

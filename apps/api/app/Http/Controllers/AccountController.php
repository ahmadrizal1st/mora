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

        // Validate group_by (no 'year' support)
        if (!in_array($groupBy, ['day', 'week', 'month'])) {
            $groupBy = 'day';
        }

        $accounts = $request->user()
            ->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
            ->orderBy('name')
            ->get();

        // Single optimized query for ALL accounts' history
        $historyData = TransactionService::getAccountsHistory($request->user(), $groupBy);
        $labels = $historyData['labels'];
        $netChanges = $historyData['net_changes'];

        // Embed history into each account
        $accounts->each(function ($account) use ($netChanges, $labels) {
            $accountChanges = $netChanges[$account->id] ?? [];
            $history = TransactionService::buildAccountHistory(
                $account->balance_raw,
                $accountChanges,
                $labels
            );
            $history['labels'] = $labels;
            $account->history = $history;
        });

        return response()->json([
            'data' => $accounts,
            'status' => 'success',
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

        if (!in_array($groupBy, ['day', 'week', 'month'])) {
            $groupBy = 'day';
        }

        $account = $request->user()
            ->accounts()
            ->with('currency')
            ->withCount(['transactions', 'incomingTransfers'])
            ->findOrFail($id);

        // Reuse the single-query approach for consistency
        $historyData = TransactionService::getAccountsHistory($request->user(), $groupBy);
        $labels = $historyData['labels'];
        $accountChanges = $historyData['net_changes'][$account->id] ?? [];

        $history = TransactionService::buildAccountHistory(
            $account->balance_raw,
            $accountChanges,
            $labels
        );
        $history['labels'] = $labels;
        $account->history = $history;

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

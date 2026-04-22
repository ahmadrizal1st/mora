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

        if (!in_array($groupBy, ['day', 'week', 'month'])) {
            $groupBy = 'day';
        }

        $accounts = $request->user()
            ->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
            ->orderBy('name')
            ->get();

        $filters = array_filter([
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ]);

        $historyData = TransactionService::getAccountsHistory($request->user(), $groupBy, $filters);
        $labels = $historyData['labels'];
        $income = $historyData['income'];
        $expense = $historyData['expense'];
        $initialBalances = $historyData['initial_balances'];

        $accounts->each(function ($account) use ($income, $expense, $labels, $initialBalances) {
            $accountData = [
                'income' => $income[$account->id] ?? [],
                'expense' => $expense[$account->id] ?? [],
            ];
            $history = TransactionService::buildAccountHistory(
                $initialBalances[$account->id] ?? 0,
                $accountData,
                $labels
            );
            $history['labels'] = $labels;
            $account->history = $history;
            
            // Current balance is the last point in history if we go up to now()
            $account->balance_raw = !empty($history['balance']) ? end($history['balance']) : 0;
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

        $filters = array_filter([
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ]);

        $historyData = TransactionService::getAccountsHistory($request->user(), $groupBy, $filters);
        $labels = $historyData['labels'];
        $income = $historyData['income'];
        $expense = $historyData['expense'];
        $initialBalances = $historyData['initial_balances'];

        $accountData = [
            'income' => $income[$account->id] ?? [],
            'expense' => $expense[$account->id] ?? [],
        ];

        $history = TransactionService::buildAccountHistory(
            $initialBalances[$account->id] ?? 0,
            $accountData,
            $labels
        );
        $history['labels'] = $labels;
        $account->history = $history;
        $account->balance_raw = !empty($history['balance']) ? end($history['balance']) : 0;

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

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * List transactions with filters and pagination.
     *
     * GET /api/transactions
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'type',
            'account_id',
            'category_id',
            'status_id',
            'date_from',
            'date_to',
            'search',
            'sort_by',
            'sort_dir',
            'per_page',
            'tag_ids',
        ]);

        $transactions = TransactionService::list($request->user(), $filters);

        return response()->json($transactions);
    }

    /**
     * Create a new transaction.
     *
     * POST /api/transactions
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $transaction = TransactionService::store(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Transaksi berhasil dibuat.',
            'data' => $transaction,
        ], 201);
    }

    /**
     * Show a single transaction.
     *
     * GET /api/transactions/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $transaction = TransactionService::show($request->user(), $id);

        return response()->json([
            'data' => $transaction,
        ]);
    }

    /**
     * Update a transaction.
     *
     * PUT /api/transactions/{id}
     */
    public function update(UpdateTransactionRequest $request, int $id): JsonResponse
    {
        $transaction = TransactionService::update(
            $request->user(),
            $id,
            $request->validated()
        );

        return response()->json([
            'message' => 'Transaksi berhasil diperbarui.',
            'data' => $transaction,
        ]);
    }

    /**
     * Delete a transaction.
     *
     * DELETE /api/transactions/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        TransactionService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Transaksi berhasil dihapus.',
        ]);
    }

    /**
     * Get transaction summary statistics.
     *
     * GET /api/transactions-summary
     */
    public function summary(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to', 'account_id']);

        $summary = TransactionService::summary($request->user(), $filters);

        return response()->json([
            'data' => $summary,
        ]);
    }

    /**
     * Get historical aggregated data for charts.
     *
     * GET /api/transactions-history
     */
    public function history(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to', 'account_id']);

        $history = TransactionService::history($request->user(), $filters);

        return response()->json([
            'data' => $history,
        ]);
    }
}

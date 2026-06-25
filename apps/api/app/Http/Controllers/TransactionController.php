<?php

namespace App\Http\Controllers;

use App\Data\TransactionData;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Services\TransactionService;
use Spatie\LaravelData\DataCollection;
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

        return response()->json([
            'data' => TransactionData::collect($transactions, DataCollection::class),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ]
        ]);
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
            'data' => TransactionData::from($transaction),
        ], 201);
    }

    /**
     * Show a single transaction.
     *
     * GET /api/transactions/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $transaction = TransactionService::show($request->user(), $id);

        return response()->json([
            'data' => TransactionData::from($transaction),
        ]);
    }

    /**
     * Update a transaction.
     *
     * PUT /api/transactions/{id}
     */
    public function update(UpdateTransactionRequest $request, string $id): JsonResponse
    {
        $transaction = TransactionService::update(
            $request->user(),
            $id,
            $request->validated()
        );

        return response()->json([
            'message' => 'Transaksi berhasil diperbarui.',
            'data' => TransactionData::from($transaction),
        ]);
    }

    /**
     * Delete a transaction.
     *
     * DELETE /api/transactions/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
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
        $filters = $request->only(['date_from', 'date_to', 'account_id', 'group_by']);

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
        $filters = $request->only(['date_from', 'date_to', 'account_id', 'group_by']);

        $history = TransactionService::history($request->user(), $filters);

        return response()->json([
            'data' => $history,
        ]);
    }

    /**
     * Get expense statistics by category.
     *
     * GET /api/transactions-statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $stats = $user->transactions()
            ->where('type', 'expense')
            ->selectRaw('category_id, sum(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->get();
            
        $statSeries = $stats->map(function ($st) {
            return [
                'name' => $st->category ? $st->category->name : 'Uncategorized',
                'data' => [(float)$st->total],
                'color' => $st->category ? $st->category->color : 'gray',
            ];
        })->values()->toArray();

        return response()->json([
            'data' => [
                'total' => $stats->sum('total'),
                'series' => count($statSeries) > 0 ? $statSeries : []
            ],
        ]);
    }
}

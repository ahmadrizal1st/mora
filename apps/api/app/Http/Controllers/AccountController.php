<?php

namespace App\Http\Controllers;

use App\Data\AccountData;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;

class AccountController extends Controller
{
    /**
     * List all accounts for the authenticated user.
     *
     * GET /api/accounts
     */
    public function index(Request $request): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $accounts = AccountService::listWithHistory($request->user(), $groupBy, $filters);

        return response()->json([
            'data' => AccountData::collect($accounts, DataCollection::class)
        ]);
    }

    /**
     * Create a new account.
     *
     * POST /api/accounts
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = AccountService::store($request->user(), $request->validated());

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'data' => AccountData::from($account),
        ], 201);
    }

    /**
     * Show a single account.
     *
     * GET /api/accounts/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $account = AccountService::showWithHistory($request->user(), $id, $groupBy, $filters);

        return response()->json([
            'data' => AccountData::from($account)
        ]);
    }

    /**
     * Update an account.
     *
     * PUT /api/accounts/{id}
     */
    public function update(UpdateAccountRequest $request, string $id): JsonResponse
    {
        $account = AccountService::update($request->user(), $id, $request->validated());

        return response()->json([
            'message' => 'Akun berhasil diperbarui.',
            'data' => AccountData::from($account),
        ]);
    }

    /**
     * Delete an account.
     *
     * DELETE /api/accounts/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        AccountService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Akun berhasil dihapus.',
        ]);
    }
    /**
     * Get account summary.
     *
     * GET /api/accounts-summary
     */
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $balances = \App\Repositories\AccountRepository::getBalances($user);
        $totalBalance = array_sum($balances);
        
        return response()->json([
            'data' => [
                'total_balance' => $totalBalance,
                'balances' => $balances,
            ]
        ]);
    }

    /**
     * Get account analytics (top merchants, stats, insights)
     * 
     * GET /api/accounts-analytics
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $accountId = $request->query('account_id');
        $month = $request->query('month', date('m'));
        $year = $request->query('year', date('Y'));

        $query = $user->transactions()
            ->whereMonth('tx_date', $month)
            ->whereYear('tx_date', $year);

        if ($accountId) {
            $query->where('account_id', $accountId);
        }

        // 1. Top Merchants
        $merchants = (clone $query)
            ->where('type', 'expense')
            ->whereNotNull('merchant')
            ->selectRaw('merchant as name, count(*) as count, sum(amount) as amount, MAX(CAST(category_id AS varchar)) as category_id')
            ->groupBy('merchant')
            ->orderByDesc('amount')
            ->limit(5)
            ->with('category')
            ->get()
            ->map(function ($m) {
                return [
                    'name' => $m->name,
                    'cat' => $m->category ? $m->category->name : 'Uncategorized',
                    'amount' => 'Rp ' . number_format($m->amount, 0, ',', '.'),
                    'count' => $m->count,
                    'icon' => $m->category ? $m->category->icon : 'building-store',
                    'color' => $m->category ? $m->category->color : 'gray',
                ];
            });

        // 2. Stats
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $expenses = clone $query;
        $totalExpense = (clone $expenses)->where('type', 'expense')->sum('amount');
        $totalIncome = (clone $query)->where('type', 'income')->sum('amount');
        $txCount = (clone $expenses)->count();
        
        $mostExpensiveDayRecord = (clone $expenses)
            ->where('type', 'expense')
            ->selectRaw('tx_date, sum(amount) as total')
            ->groupBy('tx_date')
            ->orderByDesc('total')
            ->first();

        $stats = [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'net_balance' => $totalIncome - $totalExpense,
            'daily_avg' => 'Rp ' . number_format($totalExpense / $daysInMonth, 0, ',', '.'),
            'frequency' => round($txCount / $daysInMonth, 1) . 'x / hari',
            'most_expensive_day' => $mostExpensiveDayRecord 
                ? \Carbon\Carbon::parse($mostExpensiveDayRecord->tx_date)->locale('id')->translatedFormat('l, d F') 
                : '-',
        ];

        // 3. Expenses by Category (Dipindah ke atas agar bisa dipakai di insight)
        $expensesByCategory = (clone $query)
            ->where('type', 'expense')
            ->selectRaw('category_id, sum(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->orderByDesc('total')
            ->get();

        $expensesByCategoryMapped = $expensesByCategory->map(function ($c) {
                return [
                    'category' => $c->category ? [
                        'name' => $c->category->name,
                        'color' => $c->category->color,
                        'icon' => $c->category->icon,
                    ] : null,
                    'total' => $c->total,
                ];
            });

        // 4. Insights (Real Database Logic)
        $insights = [];
        
        // Insight 1: Subscriptions (Dari DB)
        $subsCount = $user->subscriptions()->count();
        if ($subsCount > 0) {
            $insights[] = [
                'title' => 'Langganan Aktif',
                'desc' => "Anda memiliki {$subsCount} tagihan langganan aktif.",
                'icon' => 'alert-triangle',
                'color' => 'warning',
            ];
        }

        // Insight 2: Goals (Dari DB)
        $goalsCount = $user->goals()->where('current_amount', '<', \DB::raw('target_amount'))->count();
        if ($goalsCount > 0) {
            $insights[] = [
                'title' => 'Target Tabungan',
                'desc' => "Teruskan menabung untuk mencapai {$goalsCount} target Anda.",
                'icon' => 'bulb',
                'color' => 'blue',
            ];
        }

        // Insight 3: Kategori Terbesar (Dari DB)
        $topCategory = $expensesByCategory->first();
        if ($topCategory && $topCategory->total > 0) {
            $catName = $topCategory->category ? $topCategory->category->name : 'Lainnya';
            $insights[] = [
                'title' => 'Kategori Paling Boros',
                'desc' => "Pengeluaran terbesar bulan ini ada pada kategori {$catName}.",
                'icon' => 'chart-pie',
                'color' => 'red',
            ];
        }

        // Insight 4: Rasio Pengeluaran (Dari DB)
        if ($totalIncome > 0) {
            $ratio = round(($totalExpense / $totalIncome) * 100);
            $insights[] = [
                'title' => 'Rasio Pengeluaran',
                'desc' => "Anda telah menghabiskan {$ratio}% dari pemasukan bulan ini.",
                'icon' => $ratio > 80 ? 'alert-circle' : 'thumb-up',
                'color' => $ratio > 80 ? 'red' : 'green',
            ];
        }

        // Insight 5: Hari Paling Boros (Dari DB)
        if ($mostExpensiveDayRecord) {
            $formattedDate = \Carbon\Carbon::parse($mostExpensiveDayRecord->tx_date)->locale('id')->translatedFormat('d F');
            $insights[] = [
                'title' => 'Pengeluaran Tertinggi',
                'desc' => "Pengeluaran terbesar harian Anda bulan ini terjadi pada {$formattedDate}.",
                'icon' => 'trending-down',
                'color' => 'purple',
            ];
        }

        // Jika belum ada data sama sekali
        if (count($insights) === 0) {
             $insights[] = [
                'title' => 'Belum Ada Transaksi',
                'desc' => 'Mulai catat transaksi untuk melihat analisa keuangan di sini.',
                'icon' => 'info-circle',
                'color' => 'blue',
            ];
        }

        // 5. Recent Transactions
        $recentTransactions = (clone $query)
            ->with(['category', 'account'])
            ->orderByDesc('tx_date')
            ->orderByDesc('id')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => [
                'merchants' => $merchants,
                'stats' => $stats,
                'insights' => $insights,
                'expenses_by_category' => $expensesByCategoryMapped,
                'recent_transactions' => $recentTransactions,
            ]
        ]);
    }

    /**
     * Resolve common query parameters for account listings.
     */
    private function resolveRequestParams(Request $request): array
    {
        $groupBy = $request->query('group_by', 'day');
        if (!in_array($groupBy, ['day', 'week', 'month'])) {
            $groupBy = 'day';
        }

        $filters = array_filter([
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ]);

        return [$groupBy, $filters];
    }
}

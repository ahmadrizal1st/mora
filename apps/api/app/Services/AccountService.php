<?php

namespace App\Services;

use App\Models\Account;
use App\Models\User;
use App\Repositories\AccountRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AccountService
{
    private static function addHistoryToAccount($account, User $user, string $groupBy, array $filters): void
    {
        $currentBalances = AccountRepository::getBalances($user);
        $historyData = TransactionService::getAccountsHistory($user, $groupBy, $filters);
        $labels = $historyData['labels'];
        $income = $historyData['income'];
        $expense = $historyData['expense'];
        $initialBalances = $historyData['initial_balances'];

        $aid = (string)$account->id;
        $accountData = [
            'income' => $income[$aid] ?? [],
            'expense' => $expense[$aid] ?? [],
        ];
        $history = TransactionService::buildAccountHistory(
            $initialBalances[$aid] ?? 0,
            $accountData,
            $labels
        );
        $history['labels'] = $labels;
        $account->history = $history;
        $account->balance = $currentBalances[$aid] ?? 0;
    }

    public static function listWithHistory(User $user, string $groupBy = 'day', array $filters = []): Collection
    {
        $accounts = AccountRepository::getAllForUser($user);

        $accounts->each(function ($account) use ($user, $groupBy, $filters) {
            self::addHistoryToAccount($account, $user, $groupBy, $filters);
        });

        return $accounts;
    }

    public static function showWithHistory(User $user, string $id, string $groupBy = 'day', array $filters = []): Account
    {
        $account = AccountRepository::findForUser($user, $id);
        self::addHistoryToAccount($account, $user, $groupBy, $filters);
        return $account;
    }

    public static function store(User $user, array $data): Account
    {
        return AccountRepository::store($user, $data);
    }

    public static function update(User $user, string $id, array $data): Account
    {
        $account = AccountRepository::findForUser($user, $id);
        return AccountRepository::update($account, $data);
    }

    public static function destroy(User $user, string $id): void
    {
        $account = AccountRepository::findForUser($user, $id);

        if (AccountRepository::hasTransactions($account)) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak bisa dihapus karena masih memiliki transaksi.'],
            ]);
        }

        AccountRepository::destroy($account);
    }

    public static function summary(User $user): array
    {
        $balances = AccountRepository::getBalances($user);
        $totalBalance = array_sum($balances);
        
        return [
            'total_balance' => $totalBalance,
            'balances' => $balances,
        ];
    }

    public static function analytics(User $user, ?string $accountId, ?int $month = null, ?int $year = null): array
    {
        $month = $month ?? date('m');
        $year = $year ?? date('Y');

        $query = AccountRepository::getAnalyticsQuery($user, $accountId, $month, $year);
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $merchants = AccountRepository::getTopMerchants($query)->map(function ($m) {
            return [
                'name' => $m->name,
                'cat' => $m->category ? $m->category->name : 'Uncategorized',
                'amount' => 'Rp ' . number_format($m->amount, 0, ',', '.'),
                'count' => $m->count,
                'icon' => $m->category ? $m->category->icon : 'building-store',
                'color' => $m->category ? $m->category->color : 'gray',
            ];
        });

        $totalExpense = AccountRepository::getTotalExpense($query);
        $totalIncome = AccountRepository::getTotalIncome($query);
        $txCount = AccountRepository::getTransactionCount($query);
        
        $mostExpensiveDayRecord = AccountRepository::getMostExpensiveDay($query);

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

        $expensesByCategory = AccountRepository::getExpensesByCategory($query);
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

        $insights = [];
        
        $subsCount = $user->subscriptions()->count();
        if ($subsCount > 0) {
            $insights[] = [
                'title' => 'Langganan Aktif',
                'desc' => "Anda memiliki {$subsCount} tagihan langganan aktif.",
                'icon' => 'alert-triangle',
                'color' => 'warning',
            ];
        }

        $goalsCount = $user->goals()->where('current_amount', '<', \DB::raw('target_amount'))->count();
        if ($goalsCount > 0) {
            $insights[] = [
                'title' => 'Target Tabungan',
                'desc' => "Teruskan menabung untuk mencapai {$goalsCount} target Anda.",
                'icon' => 'bulb',
                'color' => 'blue',
            ];
        }

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

        if ($totalIncome > 0) {
            $ratio = round(($totalExpense / $totalIncome) * 100);
            $insights[] = [
                'title' => 'Rasio Pengeluaran',
                'desc' => "Anda telah menghabiskan {$ratio}% dari pemasukan bulan ini.",
                'icon' => $ratio > 80 ? 'alert-circle' : 'thumb-up',
                'color' => $ratio > 80 ? 'red' : 'green',
            ];
        }

        if ($mostExpensiveDayRecord) {
            $formattedDate = \Carbon\Carbon::parse($mostExpensiveDayRecord->tx_date)->locale('id')->translatedFormat('d F');
            $insights[] = [
                'title' => 'Pengeluaran Tertinggi',
                'desc' => "Pengeluaran terbesar harian Anda bulan ini terjadi pada {$formattedDate}.",
                'icon' => 'trending-down',
                'color' => 'purple',
            ];
        }

        if (count($insights) === 0) {
             $insights[] = [
                'title' => 'Belum Ada Transaksi',
                'desc' => 'Mulai catat transaksi untuk melihat analisa keuangan di sini.',
                'icon' => 'info-circle',
                'color' => 'blue',
            ];
        }

        $recentTransactions = AccountRepository::getRecentTransactions($query);

        return [
            'merchants' => $merchants,
            'stats' => $stats,
            'insights' => $insights,
            'expenses_by_category' => $expensesByCategoryMapped,
            'recent_transactions' => $recentTransactions,
        ];
    }
}

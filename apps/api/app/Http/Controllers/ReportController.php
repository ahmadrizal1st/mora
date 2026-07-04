<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getRecap(Request $request): JsonResponse
    {
        $user = $request->user();
        $dateFromRaw = $request->query('date_from');
        $dateToRaw = $request->query('date_to');

        if (!$dateFromRaw || !$dateToRaw) {
            return response()->json(['error' => 'date_from and date_to parameters are required.'], 400);
        }

        $dateFrom = Carbon::parse($dateFromRaw)->startOfDay();
        $dateTo = Carbon::parse($dateToRaw)->endOfDay();

        // 1. Total income & expenses
        $txQuery = $user->transactions()
            ->whereBetween('tx_date', [$dateFrom, $dateTo]);

        $income = (float) (clone $txQuery)->where('type', Transaction::TYPE_INCOME)->sum('amount');
        $expense = (float) (clone $txQuery)->where('type', Transaction::TYPE_EXPENSE)->sum('amount');
        $totalTx = (int) (clone $txQuery)->count();

        $savingRate = $income > 0 ? (int) round((($income - $expense) / $income) * 100) : 0;

        // 2. Kategori Juara (Top expense category)
        $topCategory = DB::table('transactions')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(transactions.amount) as total_amount'))
            ->where('transactions.user_id', $user->id)
            ->where('transactions.type', Transaction::TYPE_EXPENSE)
            ->whereBetween('transactions.tx_date', [$dateFrom, $dateTo])
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_amount')
            ->first();

        $kategoriJuaraStr = '-';
        if ($topCategory) {
            $pct = $expense > 0 ? round(($topCategory->total_amount / $expense) * 100) : 0;
            $kategoriJuaraStr = $topCategory->name . ' · ' . $pct . '%';
        }

        // 3. Pengeluaran Terbesar
        $maxExpense = (clone $txQuery)
            ->where('type', Transaction::TYPE_EXPENSE)
            ->with('category')
            ->orderByDesc('amount')
            ->first();

        $maxExpenseStr = '-';
        if ($maxExpense) {
            $merchantOrCat = $maxExpense->merchant ?: ($maxExpense->category ? $maxExpense->category->name : 'Pengeluaran');
            $maxExpenseStr = $merchantOrCat . ' · ' . number_format($maxExpense->amount, 0, ',', '.');
        }

        // 4. Hari paling boros
        $dayOfWeekNames = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        $topDay = DB::table('transactions')
            ->select('tx_date', DB::raw('SUM(amount) as total_amount'))
            ->where('user_id', $user->id)
            ->where('type', Transaction::TYPE_EXPENSE)
            ->whereBetween('tx_date', [$dateFrom, $dateTo])
            ->groupBy('tx_date')
            ->orderByDesc('total_amount')
            ->first();

        $maxExpenseDayStr = '-';
        if ($topDay) {
            $topDayDate = Carbon::parse($topDay->tx_date);
            $dayName = $dayOfWeekNames[$topDayDate->dayOfWeek] ?? '';
            // e.g. "Jumat, 4 Jul 2026 · 150.000"
            $monthShort = $topDayDate->translatedFormat('M');
            $dateStr = $dayName . ', ' . $topDayDate->day . ' ' . $monthShort . ' ' . $topDayDate->year;
            $maxExpenseDayStr = $dateStr . ' · ' . number_format($topDay->total_amount, 0, ',', '.');
        }

        // 5. Hari tanpa belanja
        $totalDaysInMonth = $dateFrom->diffInDays($dateTo) + 1;
        $uniqueExpenseDays = DB::table('transactions')
            ->where('user_id', $user->id)
            ->where('type', Transaction::TYPE_EXPENSE)
            ->whereBetween('tx_date', [$dateFrom, $dateTo])
            ->distinct('tx_date')
            ->count('tx_date');

        $noSpendDays = max(0, (int) ($totalDaysInMonth - $uniqueExpenseDays));

        // 6. Waktu paling boros (using created_at hour)
        $hourCounts = ['Pagi' => 0, 'Siang' => 0, 'Sore' => 0, 'Malam' => 0];
        $hours = DB::table('transactions')
            ->select(DB::raw('HOUR(created_at) as hr'), DB::raw('count(*) as count'))
            ->where('user_id', $user->id)
            ->where('type', Transaction::TYPE_EXPENSE)
            ->whereBetween('tx_date', [$dateFrom, $dateTo])
            ->groupBy('hr')
            ->get();

        foreach ($hours as $h) {
            $hr = (int) $h->hr;
            if ($hr >= 5 && $hr < 11) {
                $hourCounts['Pagi'] += $h->count;
            } elseif ($hr >= 11 && $hr < 15) {
                $hourCounts['Siang'] += $h->count;
            } elseif ($hr >= 15 && $hr < 19) {
                $hourCounts['Sore'] += $h->count;
            } else {
                $hourCounts['Malam'] += $h->count;
            }
        }

        arsort($hourCounts);
        $topTimeGroup = key($hourCounts);
        $timeRanges = [
            'Pagi' => 'Pagi Hari · 05:00 - 11:00',
            'Siang' => 'Siang Hari · 11:00 - 15:00',
            'Sore' => 'Sore Hari · 15:00 - 19:00',
            'Malam' => 'Malam Hari · 19:00 - 05:00'
        ];
        $mainTimeStr = $hourCounts[$topTimeGroup] > 0 ? $timeRanges[$topTimeGroup] : 'Sore Hari · 16:00 - 19:00';

        // 7. Dompet paling sering
        $topAccount = DB::table('transactions')
            ->join('accounts', 'transactions.account_id', '=', 'accounts.id')
            ->select('accounts.name', DB::raw('count(*) as count'))
            ->where('transactions.user_id', $user->id)
            ->whereBetween('transactions.tx_date', [$dateFrom, $dateTo])
            ->groupBy('accounts.id', 'accounts.name')
            ->orderByDesc('count')
            ->first();

        $mainAccountStr = '-';
        if ($topAccount) {
            $mainAccountStr = $topAccount->name . ' · ' . $topAccount->count . '×';
        }

        // 8. Kepatuhan Anggaran (Dynamic from active plan)
        $activePlan = DB::table('budget_plans')
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->first();

        $budgetComplianceStr = '100% · Semua kategori aman';
        if ($activePlan) {
            $items = DB::table('budget_items')
                ->where('budget_plan_id', $activePlan->id)
                ->get();

            $overLimitCount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {
                // spent
                // categories mapping
                $categoryIds = DB::table('budget_item_categories')
                    ->where('budget_item_id', $item->id)
                    ->pluck('category_id');

                $spent = DB::table('transactions')
                    ->where('user_id', $user->id)
                    ->where('type', Transaction::TYPE_EXPENSE)
                    ->whereIn('category_id', $categoryIds)
                    ->whereBetween('tx_date', [$activePlan->start_date, $activePlan->end_date])
                    ->sum('amount');

                $limit = $item->amount_limit;
                if ($item->percentage && $activePlan->income_baseline > 0) {
                    $limit = ($item->percentage / 100) * $activePlan->income_baseline;
                }

                if ($spent > $limit) {
                    $overLimitCount++;
                }
            }

            if ($totalItems > 0) {
                $compliancePct = round((($totalItems - $overLimitCount) / $totalItems) * 100);
                if ($overLimitCount === 0) {
                    $budgetComplianceStr = $compliancePct . '% · Semua kategori aman';
                } else {
                    $budgetComplianceStr = $compliancePct . '% · ' . $overLimitCount . ' kategori melebihi batas';
                }
            } else {
                $budgetComplianceStr = 'Belum Ada Anggaran';
            }
        } else {
            $budgetComplianceStr = 'Belum Ada Anggaran';
        }

        // 9. Pinjaman terbesar ke (receivable)
        $largestReceivable = DB::table('debts')
            ->where('user_id', $user->id)
            ->where('type', 'Piutang')
            ->where('status', '!=', 'Lunas')
            ->orderByDesc('amount')
            ->first();

        $largestReceivableStr = '-';
        if ($largestReceivable) {
            $largestReceivableStr = $largestReceivable->person_name . ' · ' . number_format($largestReceivable->amount, 0, ',', '.');
        }

        // 10. Perubahan dibanding bulan lalu (expense trend)
        $diffInDays = $dateFrom->diffInDays($dateTo) + 1;
        $prevTo = $dateFrom->copy()->subDay()->endOfDay();
        $prevFrom = $prevTo->copy()->subDays($diffInDays - 1)->startOfDay();

        $prevExpense = DB::table('transactions')
            ->where('user_id', $user->id)
            ->where('type', Transaction::TYPE_EXPENSE)
            ->whereBetween('tx_date', [$prevFrom, $prevTo])
            ->sum('amount');

        $expenseTrend = 0.0;
        if ($prevExpense > 0) {
            $expenseTrend = round((($expense - $prevExpense) / $prevExpense) * 100, 1);
        } else {
            $expenseTrend = $expense > 0 ? 100.0 : 0.0;
        }

        $trendDirection = $expenseTrend < 0 ? 'Lebih Hemat' : 'Lebih Boros';
        $trendSign = $expenseTrend > 0 ? '+' : '';
        $expenseTrendStr = $trendSign . $expenseTrend . '% (' . $trendDirection . ')';

        return response()->json([
            'data' => [
                'income' => $income,
                'expense' => $expense,
                'total_tx' => $totalTx,
                'saving_rate' => $savingRate,
                'kategori_juara' => $kategoriJuaraStr,
                'pengeluaran_terbesar' => $maxExpenseStr,
                'hari_paling_boros' => $maxExpenseDayStr,
                'hari_tanpa_belanja' => $noSpendDays,
                'waktu_paling_boros' => $mainTimeStr,
                'dompet_paling_sering' => $mainAccountStr,
                'kepatuhan_anggaran' => $budgetComplianceStr,
                'pinjaman_terbesar_ke' => $largestReceivableStr,
                'perubahan_dibanding_bulan_lalu' => $expenseTrendStr,
            ]
        ]);
    }
}

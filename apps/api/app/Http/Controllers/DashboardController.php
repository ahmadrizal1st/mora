<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Transaction;
use App\Models\Goal;
use App\Models\BudgetPlan;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();

        // Basic Summary
        $balances = \App\Repositories\AccountRepository::getBalances($user);
        $balance = array_sum($balances);
        $income = $user->transactions()->where('type', 'income')->sum('amount');
        $expense = $user->transactions()->where('type', 'expense')->sum('amount');
        $savings = $user->goals()->sum('current_amount');

        // Savings Plans
        $goals = $user->goals()->get()->map(function ($g) {
            $prog = $g->target_amount > 0 ? ($g->current_amount / $g->target_amount) * 100 : 0;
            return [
                'name' => $g->name,
                'current' => 'Rp ' . number_format($g->current_amount, 0, ',', '.'),
                'target' => 'Rp ' . number_format($g->target_amount, 0, ',', '.'),
                'progress' => round($prog, 2),
                'icon' => $g->icon ?: 'star',
            ];
        });

        // Limits (from Active Budget Plan)
        $activePlan = $user->budgetPlans()->where('is_active', true)->first();
        $dailySpent = 0;
        $dailyLimit = 0;
        $dailyProgress = 0;
        if ($activePlan) {
            // simplified daily calculation
            $daysInMonth = (int) now()->endOfMonth()->format('d');
            $dailyLimit = $activePlan->income_baseline / $daysInMonth;
            $dailySpent = $user->transactions()->where('type', 'expense')->whereDate('tx_date', now()->toDateString())->sum('amount');
            $dailyProgress = $dailyLimit > 0 ? min(100, round(($dailySpent / $dailyLimit) * 100, 2)) : 0;
        }

        // Recent Transactions
        $recentTransactions = $user->transactions()->with('category')->latest('tx_date')->take(5)->get()->map(function ($tx) {
            return [
                'id' => $tx->id,
                'subject' => $tx->category ? $tx->category->name : 'Uncategorized',
                'client' => $tx->merchant ?: 'Unknown',
                'date' => $tx->tx_date->format('Y-m-d H:i:s'),
                'status' => 'Completed',
                'statusColor' => 'success',
                'price' => 'Rp ' . number_format($tx->amount, 0, ',', '.'),
                'note' => $tx->notes,
            ];
        });

        // Cashflow mock (needs a group by month query, simplifying for now)
        $months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $incomeData = array_fill(0, 12, 0);
        $expenseData = array_fill(0, 12, 0);
        
        $txs = $user->transactions()
            ->selectRaw('EXTRACT(MONTH FROM tx_date) as m, type, SUM(amount) as total')
            ->whereYear('tx_date', now()->year)
            ->groupByRaw('EXTRACT(MONTH FROM tx_date), type')
            ->get();
            
        foreach ($txs as $t) {
            if ($t->type == 'income') {
                $incomeData[$t->m - 1] = (float)$t->total;
            } elseif ($t->type == 'expense') {
                $expenseData[$t->m - 1] = (float)$t->total * -1; // make it negative for chart
            }
        }

        // Statistics (Expenses by Category)
        $stats = $user->transactions()
            ->where('type', 'expense')
            ->selectRaw('category_id, SUM(amount) as total')
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

        $responseData = [
            'summary' => [
                'balance' => 'Rp ' . number_format($balance, 0, ',', '.'),
                'income' => 'Rp ' . number_format($income, 0, ',', '.'),
                'expense' => 'Rp ' . number_format($expense, 0, ',', '.'),
                'savings' => 'Rp ' . number_format($savings, 0, ',', '.'),
                'incomeTrend' => 0, // Not implemented yet
                'expenseTrend' => 0, // Not implemented yet
                'savingsTrend' => 0, // Not implemented yet
                'incomeSeries' => [['name' => 'Income', 'data' => [0]]], // Not implemented yet
                'expenseSeries' => [['name' => 'Expense', 'data' => [0]]], // Not implemented yet
                'savingsSeries' => [['name' => 'Savings', 'data' => [0]]], // Not implemented yet
            ],
            'limits' => [
                'daily' => [
                    'spent' => 'Rp ' . number_format($dailySpent, 2, ',', '.'),
                    'total' => 'Rp ' . number_format($dailyLimit, 2, ',', '.'),
                    'progress' => $dailyProgress,
                ]
            ],
            'savingsPlans' => $goals,
            'cashflow' => [
                'series' => [
                    ['name' => 'Income', 'data' => $incomeData, 'color' => 'teal'],
                    ['name' => 'Expense', 'data' => $expenseData, 'color' => 'lime'],
                ],
                'months' => $months,
            ],
            'statistics' => [
                'total' => 'Rp ' . number_format($expense, 0, ',', '.'),
                'series' => count($statSeries) > 0 ? $statSeries : []
            ],
            'recentTransactions' => $recentTransactions,
            'activities' => []
        ];

        return response()->json(['data' => $responseData]);
    }
}

<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    /**
     * List transactions for a user with filters and pagination.
     */
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->transactions()
            ->with(['account', 'toAccount', 'category', 'status', 'currency', 'recurringType', 'tags']);

        // Filter by type
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Filter by account
        if (!empty($filters['account_id'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('account_id', $filters['account_id'])
                    ->orWhere('to_account_id', $filters['account_id']);
            });
        }

        // Filter by category
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Filter by status
        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $query->where('tx_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('tx_date', '<=', $filters['date_to']);
        }

        // Search by merchant or notes
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('merchant', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Filter by tags (AND matching: must have ALL selected tags)
        if (!empty($filters['tag_ids'])) {
            $tagIds = is_array($filters['tag_ids']) ? $filters['tag_ids'] : explode(',', $filters['tag_ids']);
            foreach ($tagIds as $tagId) {
                $query->whereHas('tags', function ($q) use ($tagId) {
                    $q->where('tags.id', $tagId);
                });
            }
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'tx_date';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        if ($sortBy === 'nominal') {
            $query->orderBy('amount_raw', $sortDir);
        } elseif ($sortBy === 'category') {
            $query->select('transactions.*')
                ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
                ->orderBy('categories.name', $sortDir);
        } elseif ($sortBy === 'account') {
            $query->select('transactions.*')
                ->leftJoin('accounts', 'transactions.account_id', '=', 'accounts.id')
                ->orderBy('accounts.name', $sortDir);
        } else {
            // Default sort (ensure column exists or fallback)
            $allowedColumns = ['tx_date', 'merchant', 'created_at', 'type'];
            $sortBy = in_array($sortBy, $allowedColumns) ? $sortBy : 'tx_date';
            $query->orderBy($sortBy, $sortDir);
        }

        $perPage = min($filters['per_page'] ?? 15, 100);

        return $query->paginate($perPage);
    }

    /**
     * Create a new transaction and update account balances.
     *
     * @return Transaction
     */
    public static function store(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            // Verify account belongs to user
            $account = $user->accounts()->findOrFail($data['account_id']);

            // Build transaction data
            $txData = [
                'user_id' => $user->id,
                'type' => $data['type'],
                'amount_raw' => $data['amount_raw'],
                'currency_id' => $data['currency_id'] ?? $account->currency_id,
                'rate_snapshot' => $data['rate_snapshot'] ?? 1,
                'amount_in_default' => $data['amount_in_default'] ?? $data['amount_raw'],
                'account_id' => $data['account_id'],
                'to_account_id' => $data['to_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'status_id' => $data['status_id'] ?? null,
                'recurring_type_id' => $data['recurring_type_id'] ?? null,
                'tx_date' => $data['tx_date'],
                'merchant' => $data['merchant'] ?? null,
                'notes' => $data['notes'] ?? null,
                'dynamic_fields' => $data['dynamic_fields'] ?? null,
            ];

            // For transfers, verify target account belongs to user
            if ($data['type'] === Transaction::TYPE_TRANSFER) {
                if (empty($data['to_account_id'])) {
                    throw ValidationException::withMessages([
                        'to_account_id' => ['Akun tujuan wajib diisi untuk transfer.'],
                    ]);
                }
                if ($data['account_id'] === $data['to_account_id']) {
                    throw ValidationException::withMessages([
                        'to_account_id' => ['Akun tujuan tidak boleh sama dengan akun asal.'],
                    ]);
                }
                $user->accounts()->findOrFail($data['to_account_id']);
            }

            $transaction = Transaction::create($txData);

            // Sync tags if provided
            if (!empty($data['tag_ids'])) {
                // Verify tags belong to user
                $validTagIds = $user->tags()->whereIn('id', $data['tag_ids'])->pluck('id');
                $transaction->tags()->sync($validTagIds);
            }

            // Update account balances
            self::applyBalance($transaction);

            return $transaction->load([
                'account',
                'toAccount',
                'category',
                'status',
                'currency',
                'recurringType',
                'tags',
            ]);
        });
    }

    /**
     * Get a single transaction with all relationships.
     */
    public static function show(User $user, int $id): Transaction
    {
        return $user->transactions()
            ->with(['account', 'toAccount', 'category', 'status', 'currency', 'recurringType', 'tags'])
            ->findOrFail($id);
    }

    /**
     * Update a transaction and re-calculate account balances.
     */
    public static function update(User $user, int $id, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $transaction = $user->transactions()->findOrFail($id);

            // Revert old balance
            self::revertBalance($transaction);

            // Verify new account if changed
            if (!empty($data['account_id'])) {
                $user->accounts()->findOrFail($data['account_id']);
            }
            if (!empty($data['to_account_id'])) {
                $user->accounts()->findOrFail($data['to_account_id']);
            }

            // Update the transaction
            $transaction->update($data);

            // Re-sync tags
            if (array_key_exists('tag_ids', $data)) {
                $validTagIds = $user->tags()->whereIn('id', $data['tag_ids'] ?? [])->pluck('id');
                $transaction->tags()->sync($validTagIds);
            }

            // Apply new balance
            self::applyBalance($transaction->fresh());

            return $transaction->fresh()->load([
                'account',
                'toAccount',
                'category',
                'status',
                'currency',
                'recurringType',
                'tags',
            ]);
        });
    }

    /**
     * Delete a transaction and revert its balance effect.
     */
    public static function destroy(User $user, int $id): void
    {
        DB::transaction(function () use ($user, $id) {
            $transaction = $user->transactions()->findOrFail($id);

            // Revert balance before deleting
            self::revertBalance($transaction);

            $transaction->tags()->detach();
            $transaction->delete();
        });
    }

    /**
     * Get summary statistics for a period.
     *
     * @return array{total_income: int, total_expense: int, net_balance: int, transaction_count: int, income_trend: float, expense_trend: float, count_trend: float, balance_trend: float}
     */
    public static function summary(User $user, array $filters = []): array
    {
        $query = $user->transactions();

        if (!empty($filters['date_from'])) {
            $query->where('tx_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('tx_date', '<=', $filters['date_to']);
        }
        if (!empty($filters['account_id'])) {
            $query->where('account_id', $filters['account_id']);
        }

        $income = (clone $query)->where('type', Transaction::TYPE_INCOME)->sum('amount_raw');
        $expense = (clone $query)->where('type', Transaction::TYPE_EXPENSE)->sum('amount_raw');
        $count = (clone $query)->count();

        // Calculate Previous Period for Trends
        $prevIncome = 0;
        $prevExpense = 0;
        $prevCount = 0;

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $currentFrom = \Carbon\Carbon::parse($filters['date_from']);
            $currentTo = \Carbon\Carbon::parse($filters['date_to']);
            $diffInDays = $currentFrom->diffInDays($currentTo) + 1;

            $prevTo = $currentFrom->copy()->subDay();
            $prevFrom = $prevTo->copy()->subDays($diffInDays - 1);

            $prevQuery = $user->transactions()
                ->where('tx_date', '>=', $prevFrom->toDateString())
                ->where('tx_date', '<=', $prevTo->toDateString());

            if (!empty($filters['account_id'])) {
                $prevQuery->where('account_id', $filters['account_id']);
            }

            $prevIncome = (clone $prevQuery)->where('type', Transaction::TYPE_INCOME)->sum('amount_raw');
            $prevExpense = (clone $prevQuery)->where('type', Transaction::TYPE_EXPENSE)->sum('amount_raw');
            $prevCount = (clone $prevQuery)->count();
        }

        $calcTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }
            return round((($current - $previous) / $previous) * 100, 1);
        };

        return [
            'total_income' => (int) $income,
            'total_expense' => (int) $expense,
            'net_balance' => (int) ($income - $expense),
            'transaction_count' => $count,
            'income_trend' => (float) $calcTrend($income, $prevIncome),
            'expense_trend' => (float) $calcTrend($expense, $prevExpense),
            'count_trend' => (float) $calcTrend($count, $prevCount),
            'balance_trend' => (float) $calcTrend($income - $expense, $prevIncome - $prevExpense),
        ];
    }

    /**
     * Get historical aggregated data for charts.
     */
    public static function history(User $user, array $filters = []): array
    {
        $query = $user->transactions()->orderBy('tx_date', 'asc');

        if (!empty($filters['date_from'])) {
            $query->where('tx_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('tx_date', '<=', $filters['date_to']);
        }
        if (!empty($filters['account_id'])) {
            $query->where('account_id', $filters['account_id']);
        }

        $results = $query->get();

        // Individual Income Data
        $incomeTxs = $results->where('type', Transaction::TYPE_INCOME);
        $income = $incomeTxs->pluck('amount_raw')->map(fn($v) => (int) $v)->values()->toArray();
        $incomeLabels = $incomeTxs->map(fn($row) => $row->tx_date->format('Y-m-d'))->values()->toArray();

        // Individual Expense Data
        $expenseTxs = $results->where('type', Transaction::TYPE_EXPENSE);
        $expense = $expenseTxs->pluck('amount_raw')->map(fn($v) => (int) $v)->values()->toArray();
        $expenseLabels = $expenseTxs->map(fn($row) => $row->tx_date->format('Y-m-d'))->values()->toArray();

        // Daily Aggregated Count
        $dailyGroups = $results->groupBy(fn($row) => $row->tx_date->format('Y-m-d'));
        $count = $dailyGroups->map(fn($group) => $group->count())->values()->toArray();
        $countLabels = $dailyGroups->keys()->toArray();

        return [
            'income' => $income,
            'income_labels' => $incomeLabels,
            'expense' => $expense,
            'expense_labels' => $expenseLabels,
            'count' => $count,
            'count_labels' => $countLabels,
        ];
    }

    /**
     * Apply balance change to accounts based on transaction type.
     */
    private static function applyBalance(Transaction $transaction): void
    {
        $amount = $transaction->amount_raw;

        match ($transaction->type) {
            Transaction::TYPE_INCOME => Account::where('id', $transaction->account_id)
                ->increment('balance_raw', $amount),

            Transaction::TYPE_EXPENSE => Account::where('id', $transaction->account_id)
                ->decrement('balance_raw', $amount),

            Transaction::TYPE_TRANSFER => (function () use ($transaction, $amount) {
                    Account::where('id', $transaction->account_id)
                    ->decrement('balance_raw', $amount);
                    if ($transaction->to_account_id) {
                        Account::where('id', $transaction->to_account_id)
                        ->increment('balance_raw', $amount);
                    }
                })(),
        };
    }

    /**
     * Revert balance change from accounts (used before update/delete).
     */
    private static function revertBalance(Transaction $transaction): void
    {
        $amount = $transaction->amount_raw;

        match ($transaction->type) {
            Transaction::TYPE_INCOME => Account::where('id', $transaction->account_id)
                ->decrement('balance_raw', $amount),

            Transaction::TYPE_EXPENSE => Account::where('id', $transaction->account_id)
                ->increment('balance_raw', $amount),

            Transaction::TYPE_TRANSFER => (function () use ($transaction, $amount) {
                    Account::where('id', $transaction->account_id)
                    ->increment('balance_raw', $amount);
                    if ($transaction->to_account_id) {
                        Account::where('id', $transaction->to_account_id)
                        ->decrement('balance_raw', $amount);
                    }
                })(),
        };
    }
}

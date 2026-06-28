<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TransactionRepository
{
    
    public static function queryForUser(User $user): \Spatie\QueryBuilder\QueryBuilder
    {
        return \Spatie\QueryBuilder\QueryBuilder::for(Transaction::class)
            ->where('transactions.user_id', $user->id)
            ->allowedFilters(
                \Spatie\QueryBuilder\AllowedFilter::exact('type'),
                \Spatie\QueryBuilder\AllowedFilter::exact('account_id'),
                \Spatie\QueryBuilder\AllowedFilter::exact('category_id'),
                \Spatie\QueryBuilder\AllowedFilter::exact('status_id'),
                \Spatie\QueryBuilder\AllowedFilter::callback('date_from', function ($query, $value) {
                    $query->where('tx_date', '>=', $value);
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('date_to', function ($query, $value) {
                    $query->where('tx_date', '<=', $value);
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('merchant', 'like', "%{$value}%")
                            ->orWhere('notes', 'like', "%{$value}%");
                    });
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('tag_ids', function ($query, $value) {
                    $tagIds = is_array($value) ? $value : explode(',', $value);
                    $query->whereHas('tags', function ($q) use ($tagIds) {
                        $q->whereIn('tags.id', $tagIds);
                    });
                })
            )
            ->allowedSorts('tx_date', 'amount', 'merchant', 'created_at', 'type')
            ->defaultSort('-created_at', '-tx_date')
            ->with(['account', 'toAccount', 'category', 'budgetItem', 'status', 'currency', 'recurringType', 'tags']);
    }

    
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $perPage = min($filters['per_page'] ?? 15, 100);
        return self::queryForUser($user)->paginate($perPage);
    }

    public static function findForUser(User $user, string $id): Transaction
    {
        return self::queryForUser($user)->findOrFail($id);
    }

    public static function store(array $data): Transaction
    {
        return Transaction::create($data)->load([
            'account',
            'toAccount',
            'category',
            'budgetItem',
            'status',
            'currency',
            'recurringType',
            'tags',
        ]);
    }

    public static function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);
        return $transaction->fresh()->load([
            'account',
            'toAccount',
            'category',
            'budgetItem',
            'status',
            'currency',
            'recurringType',
            'tags',
        ]);
    }

    public static function destroy(Transaction $transaction): void
    {
        $transaction->tags()->detach();
        $transaction->delete();
    }

    
    public static function getSummaryTotals(User $user, array $filters): array
    {
        $accountId = $filters['account_id'] ?? null;
        $dateFrom  = $filters['date_from']  ?? null;
        $dateTo    = $filters['date_to']    ?? null;

        $base = $user->transactions()
            ->whereIn('type', [Transaction::TYPE_INCOME, Transaction::TYPE_EXPENSE]);

        if ($accountId) {
            $base->where('account_id', $accountId);
        }
        if ($dateFrom) {
            $base->where('tx_date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $base->where('tx_date', '<=', $dateTo);
        }

        $income  = (float) (clone $base)->where('type', Transaction::TYPE_INCOME)->sum('amount');
        $expense = (float) (clone $base)->where('type', Transaction::TYPE_EXPENSE)->sum('amount');
        $count   = (clone $base)->count();

        if ($accountId) {
            $transferOutQ = $user->transactions()
                ->where('type', Transaction::TYPE_TRANSFER)
                ->where('account_id', $accountId);
            if ($dateFrom) {
                $transferOutQ->where('tx_date', '>=', $dateFrom);
            }
            if ($dateTo) {
                $transferOutQ->where('tx_date', '<=', $dateTo);
            }
            $expense += (float) $transferOutQ->sum('amount');
            $count   += $transferOutQ->count();

            $transferInQ = $user->transactions()
                ->where('type', Transaction::TYPE_TRANSFER)
                ->where('to_account_id', $accountId);
            if ($dateFrom) {
                $transferInQ->where('tx_date', '>=', $dateFrom);
            }
            if ($dateTo) {
                $transferInQ->where('tx_date', '<=', $dateTo);
            }
            $income += (float) $transferInQ->sum('amount');
            $count  += $transferInQ->count();
        }

        return [$income, $expense, $count];
    }

    
    public static function fetchHistoryRows(User $user, string $pgFormat, array $filters): Collection
    {
        $accountId = $filters['account_id'] ?? null;
        $dateFrom  = $filters['date_from']  ?? null;
        $dateTo    = $filters['date_to']    ?? null;

        $params = [$pgFormat, $user->id];
        $dateWhere = '';
        
        if ($dateFrom) {
            $dateWhere .= ' AND tx_date >= ?';
            $params[] = $dateFrom;
        }
        if ($dateTo) {
            $dateWhere .= ' AND tx_date <= ?';
            $params[] = $dateTo;
        }

        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        if ($accountId) {
            $outSql = "SELECT to_char(tx_date, ?) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id=? AND account_id=? AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') {$dateWhere} GROUP BY label";
            $inSql  = "SELECT to_char(tx_date, ?) AS label, SUM(amount) AS income, 0 AS expense, COUNT(*) AS count FROM transactions WHERE user_id=? AND to_account_id=? AND type='{$tTransfer}' {$dateWhere} GROUP BY label";
            
            $sql = "SELECT label, SUM(income) AS income, SUM(expense) AS expense, SUM(count) AS count FROM (({$outSql}) UNION ALL ({$inSql})) AS combined GROUP BY label ORDER BY label ASC";
            
            $finalParams = array_merge(
                [$pgFormat, $user->id, $accountId],
                $dateFrom ? [$dateFrom] : [],
                $dateTo ? [$dateTo] : [],
                [$pgFormat, $user->id, $accountId],
                $dateFrom ? [$dateFrom] : [],
                $dateTo ? [$dateTo] : []
            );

            return collect(DB::select($sql, $finalParams));
        }

        $sql = "SELECT to_char(tx_date, ?) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type='{$tExpense}' THEN amount ELSE 0 END) AS expense, COUNT(*) AS count FROM transactions WHERE user_id=? AND type IN ('{$tIncome}','{$tExpense}') {$dateWhere} GROUP BY label ORDER BY label ASC";
        
        return collect(DB::select($sql, $params));
    }

    
    public static function getAccountsHistoryData(User $user, string $pgFormat, string $startStr, string $endStr): array
    {
        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        $txOut = DB::select("SELECT account_id, to_char(tx_date, ?) AS label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount ELSE 0 END) AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') GROUP BY account_id, label ORDER BY account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);
        
        $txIn = DB::select("SELECT to_account_id AS account_id, to_char(tx_date, ?) AS label, SUM(amount) AS income, 0 AS expense FROM transactions WHERE user_id=? AND tx_date>=? AND tx_date<=? AND type='{$tTransfer}' AND to_account_id IS NOT NULL GROUP BY to_account_id, label ORDER BY to_account_id, label", [$pgFormat, $user->id, $startStr, $endStr]);

        return [$txOut, $txIn];
    }

    
    public static function getInitialBalances(User $user, string $startStr): array
    {
        $initialBalances = [];
        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;
        
        $balanceOut = DB::select("SELECT account_id, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS inc, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount ELSE 0 END) AS exp FROM transactions WHERE user_id=? AND tx_date<? AND type IN ('{$tIncome}','{$tExpense}','{$tTransfer}') GROUP BY account_id", [$user->id, $startStr]);
        
        foreach ($balanceOut as $row) {
            $initialBalances[(string)$row->account_id] = (float)$row->inc - (float)$row->exp;
        }
        
        $balanceIn = DB::select("SELECT to_account_id AS account_id, SUM(amount) AS inc FROM transactions WHERE user_id=? AND tx_date<? AND type='{$tTransfer}' AND to_account_id IS NOT NULL GROUP BY to_account_id", [$user->id, $startStr]);
        
        foreach ($balanceIn as $row) {
            $aid = (string)$row->account_id;
            $initialBalances[$aid] = ($initialBalances[$aid] ?? 0) + (float)$row->inc;
        }

        return $initialBalances;
    }

    
    public static function getEarliestTransactionDate(User $user, ?string $accountId = null): ?string
    {
        $query = $user->transactions();
        
        if ($accountId) {
            $query->where(function ($q) use ($accountId) {
                $q->where('account_id', $accountId)
                    ->orWhere('to_account_id', $accountId);
            });
        }

        return $query->min('tx_date');
    }

    
    public static function getCategoryStatistics(User $user): Collection
    {
        return $user->transactions()
            ->where('type', Transaction::TYPE_EXPENSE)
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->get();
    }
}

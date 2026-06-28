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

        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        $labelColumn = self::getFormattedDateColumn('tx_date', $pgFormat);

        if ($accountId) {
            $outQuery = $user->transactions()
                ->selectRaw("{$labelColumn} as label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount ELSE 0 END) AS expense, COUNT(*) AS count")
                ->where('account_id', $accountId)
                ->whereIn('type', [$tIncome, $tExpense, $tTransfer]);

            $inQuery = $user->transactions()
                ->selectRaw("{$labelColumn} as label, SUM(amount) AS income, 0 AS expense, COUNT(*) AS count")
                ->where('to_account_id', $accountId)
                ->where('type', $tTransfer);

            if ($dateFrom) {
                $outQuery->where('tx_date', '>=', $dateFrom);
                $inQuery->where('tx_date', '>=', $dateFrom);
            }
            if ($dateTo) {
                $outQuery->where('tx_date', '<=', $dateTo);
                $inQuery->where('tx_date', '<=', $dateTo);
            }

            $outQuery->groupBy('label');
            $inQuery->groupBy('label');

            $unionQuery = $outQuery->unionAll($inQuery);

            return DB::query()->fromSub($unionQuery, 'combined')
                ->selectRaw('label, SUM(income) AS income, SUM(expense) AS expense, SUM(count) AS count')
                ->groupBy('label')
                ->orderBy('label', 'ASC')
                ->get();
        }

        $query = $user->transactions()
            ->selectRaw("{$labelColumn} as label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type='{$tExpense}' THEN amount ELSE 0 END) AS expense, COUNT(*) AS count")
            ->whereIn('type', [$tIncome, $tExpense]);

        if ($dateFrom) {
            $query->where('tx_date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->where('tx_date', '<=', $dateTo);
        }

        return $query->groupBy('label')->orderBy('label', 'ASC')->get();
    }

    
    public static function getAccountsHistoryData(User $user, string $pgFormat, string $startStr, string $endStr): array
    {
        $tIncome = Transaction::TYPE_INCOME;
        $tExpense = Transaction::TYPE_EXPENSE;
        $tTransfer = Transaction::TYPE_TRANSFER;

        $labelColumn = self::getFormattedDateColumn('tx_date', $pgFormat);

        $txOut = $user->transactions()
            ->selectRaw("account_id, {$labelColumn} as label, SUM(CASE WHEN type='{$tIncome}' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type IN ('{$tExpense}','{$tTransfer}') THEN amount ELSE 0 END) AS expense")
            ->whereBetween('tx_date', [$startStr, $endStr])
            ->whereIn('type', [$tIncome, $tExpense, $tTransfer])
            ->groupBy('account_id', 'label')
            ->orderBy('account_id')
            ->orderBy('label')
            ->get();

        $txIn = $user->transactions()
            ->selectRaw("to_account_id as account_id, {$labelColumn} as label, SUM(amount) AS income, 0 AS expense")
            ->whereBetween('tx_date', [$startStr, $endStr])
            ->where('type', $tTransfer)
            ->whereNotNull('to_account_id')
            ->groupBy('to_account_id', 'label')
            ->orderBy('to_account_id')
            ->orderBy('label')
            ->get();

        return [$txOut, $txIn];
    }

    private static function getFormattedDateColumn(string $column, string $pgFormat): string
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            return "to_char({$column}, '{$pgFormat}')";
        } elseif ($driver === 'sqlite') {
            return self::sqliteDateFormat($column, $pgFormat);
        } elseif ($driver === 'mysql') {
            return self::mysqlDateFormat($column, $pgFormat);
        }

        return $column;
    }

    private static function sqliteDateFormat(string $column, string $pgFormat): string
    {
        if ($pgFormat === 'YYYY-MM') {
            return "strftime('%Y-%m', {$column})";
        } elseif ($pgFormat === 'YYYY-MM-DD') {
            return "strftime('%Y-%m-%d', {$column})";
        } elseif ($pgFormat === 'YYYY') {
            return "strftime('%Y', {$column})";
        }
        return "strftime('%Y-%m-%d', {$column})";
    }

    private static function mysqlDateFormat(string $column, string $pgFormat): string
    {
        if ($pgFormat === 'YYYY-MM') {
            return "DATE_FORMAT({$column}, '%Y-%m')";
        } elseif ($pgFormat === 'YYYY-MM-DD') {
            return "DATE_FORMAT({$column}, '%Y-%m-%d')";
        } elseif ($pgFormat === 'YYYY') {
            return "DATE_FORMAT({$column}, '%Y')";
        }
        return "DATE_FORMAT({$column}, '%Y-%m-%d')";
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

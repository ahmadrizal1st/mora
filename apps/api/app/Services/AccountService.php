<?php

namespace App\Services;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountService
{
    /**
     * List all accounts for the user with their history and balance.
     */
    public static function listWithHistory(User $user, string $groupBy = 'day', array $filters = []): Collection
    {
        $accounts = $user->accounts()
            ->with(['currency'])
            ->withCount(['transactions', 'incomingTransfers'])
            ->orderBy('name')
            ->get();

        $historyData = TransactionService::getAccountsHistory($user, $groupBy, $filters);
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
            
            // Current balance is the last point in history
            $account->balance_raw = !empty($history['balance']) ? end($history['balance']) : 0;
        });

        return $accounts;
    }

    /**
     * Show a single account with history and balance.
     */
    public static function showWithHistory(User $user, int $id, string $groupBy = 'day', array $filters = []): Account
    {
        $account = $user->accounts()
            ->with('currency')
            ->withCount(['transactions', 'incomingTransfers'])
            ->findOrFail($id);

        $historyData = TransactionService::getAccountsHistory($user, $groupBy, $filters);
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

        return $account;
    }

    /**
     * Create a new account.
     */
    public static function store(User $user, array $data): Account
    {
        return $user->accounts()->create($data)->load('currency');
    }

    /**
     * Update an account.
     */
    public static function update(User $user, int $id, array $data): Account
    {
        $account = $user->accounts()->findOrFail($id);
        $account->update($data);
        return $account->fresh()->load('currency');
    }

    /**
     * Delete an account.
     */
    public static function destroy(User $user, int $id): void
    {
        $account = $user->accounts()->findOrFail($id);

        // Check if account has transactions
        if ($account->transactions()->exists() || $account->incomingTransfers()->exists()) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak bisa dihapus karena masih memiliki transaksi.'],
            ]);
        }

        $account->delete();
    }
}

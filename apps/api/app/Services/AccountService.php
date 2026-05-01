<?php

namespace App\Services;

use App\Models\Account;
use App\Models\User;
use App\Repositories\AccountRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AccountService
{
    /**
     * List all accounts for the user with their history and balance.
     */
    public static function listWithHistory(User $user, string $groupBy = 'day', array $filters = []): Collection
    {
        $accounts = AccountRepository::getAllForUser($user);
        $currentBalances = AccountRepository::getBalances($user);

        $historyData = TransactionService::getAccountsHistory($user, $groupBy, $filters);
        $labels = $historyData['labels'];
        $income = $historyData['income'];
        $expense = $historyData['expense'];
        $initialBalances = $historyData['initial_balances'];

        $accounts->each(function ($account) use ($income, $expense, $labels, $initialBalances, $currentBalances) {
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
            
            // balance is the actual current balance from all time
            $account->balance = $currentBalances[$aid] ?? 0;
        });

        return $accounts;
    }

    /**
     * Show a single account with history and balance.
     */
    public static function showWithHistory(User $user, string $id, string $groupBy = 'day', array $filters = []): Account
    {
        $account = AccountRepository::findForUser($user, $id);
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
    public static function update(User $user, string $id, array $data): Account
    {
        $account = $user->accounts()->findOrFail($id);
        $account->update($data);
        return $account->fresh()->load('currency');
    }

    /**
     * Delete an account.
     */
    public static function destroy(User $user, string $id): void
    {
        $account = $user->accounts()->findOrFail($id);

        // Check if account has transactions
        if (AccountRepository::hasTransactions($account)) {
            throw ValidationException::withMessages([
                'account' => ['Akun tidak bisa dihapus karena masih memiliki transaksi.'],
            ]);
        }

        $account->delete();
    }
}

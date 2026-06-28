<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Category;
use App\Models\Currency;
use App\Models\Status;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $type = fake()->randomElement([Transaction::TYPE_INCOME, Transaction::TYPE_EXPENSE, Transaction::TYPE_TRANSFER]);
        $account = Account::factory()->create();
        $toAccount = $type === Transaction::TYPE_TRANSFER ? Account::factory()->create(['user_id' => $account->user_id]) : null;

        return [
            'user_id' => $account->user_id,
            'type' => $type,
            'amount' => fake()->randomFloat(2, 1000, 100000),
            'currency_id' => Currency::factory(),
            'exchange_rate' => 1,
            'account_id' => $account->id,
            'to_account_id' => $toAccount?->id,
            'category_id' => Category::factory(),
            'status_id' => Status::factory(),
            'tx_date' => fake()->date(),
            'input_method' => fake()->randomElement([Transaction::METHOD_MANUAL, Transaction::METHOD_VOICE, Transaction::METHOD_RECEIPT]),
            'merchant' => fake()->company(),
            'notes' => fake()->sentence(),
        ];
    }
}

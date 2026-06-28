<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\Currency;
use App\Models\Status;
use App\Models\Transaction;
use Tests\TestCase;
use Tests\Traits\WithAuthentication;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransactionApiTest extends TestCase
{
    use RefreshDatabase, WithAuthentication;

    public function test_can_list_transactions(): void
    {
        $user = $this->authenticate();
        Transaction::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/transactions');

        $response->assertOk();
    }

    public function test_can_store_expense_transaction(): void
    {
        $user = $this->authenticate();
        $account = Account::factory()->for($user)->create();
        $currency = Currency::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'expense']);
        $status = Status::factory()->create();

        $data = [
            'type' => Transaction::TYPE_EXPENSE,
            'amount' => 50000,
            'currency_id' => $currency->id,
            'account_id' => $account->id,
            'category_id' => $category->id,
            'status_id' => $status->id,
            'tx_date' => now()->toDateString(),
            'merchant' => 'Test Merchant',
            'notes' => 'Test Notes',
        ];

        $response = $this->postJson('/api/transactions', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('transactions', [
            'type' => Transaction::TYPE_EXPENSE,
            'amount' => 50000,
            'account_id' => $account->id,
        ]);
    }
}

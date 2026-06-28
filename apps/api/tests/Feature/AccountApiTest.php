<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Currency;
use App\Models\Provider;
use App\Models\User;
use Tests\TestCase;
use Tests\Traits\WithAuthentication;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AccountApiTest extends TestCase
{
    use RefreshDatabase, WithAuthentication;

    public function test_can_list_accounts(): void
    {
        $user = $this->authenticate();
        Account::factory()->count(3)->for($user)->create();

        $response = $this->getJson('/api/accounts');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_store_account(): void
    {
        $user = $this->authenticate();
        $currency = Currency::factory()->create();
        $provider = Provider::factory()->create();
        $data = [
            'name' => 'Test Account',
            'currency_id' => $currency->id,
            'provider_id' => $provider->id,
            'account_type' => Account::TYPE_BANK,
            'color' => '#ff0000',
        ];

        $response = $this->postJson('/api/accounts', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('accounts', [
            'name' => 'Test Account',
            'currency_id' => $currency->id,
            'account_type' => Account::TYPE_BANK,
        ]);
    }

    public function test_store_account_requires_name_and_currency(): void
    {
        $this->authenticate();

        $response = $this->postJson('/api/accounts', [
            'account_type' => Account::TYPE_BANK,
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['name', 'currency_id']);
    }

    public function test_can_update_account(): void
    {
        $user = $this->authenticate();
        $account = Account::factory()->for($user)->create();
        $newCurrency = Currency::factory()->create();
        $data = [
            'name' => 'Updated Account',
            'currency_id' => $newCurrency->id,
            'account_type' => Account::TYPE_CASH,
        ];

        $response = $this->putJson("/api/accounts/{$account->id}", $data);

        $response->assertOk();
        $this->assertDatabaseHas('accounts', $data);
    }

    public function test_cannot_update_other_users_account(): void
    {
        $this->authenticate();
        $otherUser = User::factory()->create();
        $account = Account::factory()->for($otherUser)->create();

        $response = $this->putJson("/api/accounts/{$account->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertNotFound();
    }

    public function test_can_destroy_account(): void
    {
        $user = $this->authenticate();
        $account = Account::factory()->for($user)->create();

        $response = $this->deleteJson("/api/accounts/{$account->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    public function test_cannot_destroy_account_with_transactions(): void
    {
        $user = $this->authenticate();
        $account = Account::factory()->for($user)->create();
        $transaction = \App\Models\Transaction::factory()->create(['account_id' => $account->id]);

        $response = $this->deleteJson("/api/accounts/{$account->id}");

        $response->assertUnprocessable();
        $this->assertDatabaseHas('accounts', ['id' => $account->id]);
    }
}

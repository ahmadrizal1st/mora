<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_user(): void
    {
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_can_login_user(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['data' => ['token']]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertUnauthorized();
    }

    public function test_can_get_authenticated_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/auth/me');

        $response->assertOk();
        $response->assertJson(['data' => ['id' => $user->id]]);
    }

    public function test_can_logout_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/auth/logout');

        $response->assertOk();
    }
}

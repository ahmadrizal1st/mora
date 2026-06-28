<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\OtpCode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_user(): void
    {
        Notification::fake();

        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'employee',
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
        $this->assertDatabaseHas('otp_codes', [
            'email' => 'test@example.com',
            'type' => OtpCode::TYPE_REGISTER,
        ]);
        Notification::assertSentTo(
            [User::where('email', 'test@example.com')->first()],
            \App\Notifications\OtpNotification::class
        );
    }

    public function test_can_verify_registration_otp(): void
    {
        $user = User::factory()->unverified()->create();
        $otpCode = '123456';
        
        OtpCode::create([
            'email' => $user->email,
            'code' => Hash::make($otpCode),
            'type' => OtpCode::TYPE_REGISTER,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => $user->email,
            'otp' => $otpCode,
        ]);

        $response->assertOk();
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
        $this->assertDatabaseHas('otp_codes', [
            'email' => $user->email,
            'type' => OtpCode::TYPE_REGISTER,
        ]);
        $this->assertNotNull(OtpCode::where('email', $user->email)->first()->verified_at);
    }

    public function test_verify_registration_otp_fails_with_invalid_otp(): void
    {
        $user = User::factory()->unverified()->create();
        OtpCode::create([
            'email' => $user->email,
            'code' => Hash::make('123456'),
            'type' => OtpCode::TYPE_REGISTER,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => $user->email,
            'otp' => '000000',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_login_user(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['data' => ['access_token', 'user']]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_get_authenticated_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token);

        $response = $this->getJson('/api/auth/me');

        $response->assertOk();
        $response->assertJson(['user' => ['id' => $user->id]]);
    }

    public function test_can_logout_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token);

        $response = $this->postJson('/api/auth/logout');

        $response->assertOk();
    }

    public function test_can_request_forgot_password(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('otp_codes', [
            'email' => $user->email,
            'type' => OtpCode::TYPE_RESET_PASSWORD,
        ]);
        Notification::assertSentTo(
            [$user],
            \App\Notifications\OtpNotification::class
        );
    }

    public function test_can_reset_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('Oldpassword123!')]);
        $otpCode = '654321';
        
        OtpCode::create([
            'email' => $user->email,
            'code' => Hash::make($otpCode),
            'type' => OtpCode::TYPE_RESET_PASSWORD,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'otp' => $otpCode,
            'new_password' => 'Newpassword123!',
            'new_password_confirmation' => 'Newpassword123!',
        ]);

        $response->assertOk();
        $user->refresh();
        $this->assertTrue(Hash::check('Newpassword123!', $user->password));
    }
}

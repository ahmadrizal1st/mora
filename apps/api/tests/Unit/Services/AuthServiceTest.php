<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Models\OtpCode;
use App\Services\AuthService;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    public function test_register_creates_user_and_sends_otp(): void
    {
        Notification::fake();

        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ];

        $user = AuthService::register($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($data['name'], $user->name);
        $this->assertEquals($data['email'], $user->email);

        Notification::assertSentTo(
            [$user],
            \App\Notifications\OtpNotification::class
        );
    }

    public function test_verify_registration_otp_verifies_user_and_returns_token(): void
    {
        $user = User::factory()->unverified()->create();
        $otp = '123456';
        OtpService::shouldReceive('verify')->once()->with($user->email, $otp, OtpCode::TYPE_REGISTER)->andReturn(true);

        $result = AuthService::verifyRegistrationOtp($user->email, $otp);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('access_token', $result);
        $this->assertTrue($result['user']->hasVerifiedEmail());
    }

    public function test_verify_registration_otp_fails_with_invalid_otp(): void
    {
        $user = User::factory()->unverified()->create();
        OtpService::shouldReceive('verify')->once()->andReturn(false);

        $this->expectException(ValidationException::class);

        AuthService::verifyRegistrationOtp($user->email, '000000');
    }

    public function test_login_returns_token_for_verified_user(): void
    {
        $password = 'password123';
        $user = User::factory()->create(['password' => Hash::make($password)]);

        $result = AuthService::login(['email' => $user->email, 'password' => $password]);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('access_token', $result);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'test@example.com', 'password' => Hash::make('password123')]);

        $this->expectException(ValidationException::class);

        AuthService::login(['email' => 'test@example.com', 'password' => 'wrongpassword']);
    }

    public function test_login_fails_for_unverified_user(): void
    {
        $password = 'password123';
        $user = User::factory()->unverified()->create(['password' => Hash::make($password)]);

        $this->expectException(ValidationException::class);

        AuthService::login(['email' => $user->email, 'password' => $password]);
    }

    public function test_logout_deletes_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $this->actingAs($user);

        AuthService::logout($user);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_refresh_token_creates_new_token(): void
    {
        $user = User::factory()->create();
        $oldToken = $user->createToken('test')->plainTextToken;
        $this->actingAs($user);

        $newToken = AuthService::refreshToken($user);

        $this->assertNotEquals($oldToken, $newToken);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_forgot_password_sends_otp_if_user_exists(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        AuthService::forgotPassword($user->email);

        Notification::assertSentTo(
            [$user],
            \App\Notifications\OtpNotification::class
        );
    }

    public function test_reset_password_updates_password_and_deletes_tokens(): void
    {
        $user = User::factory()->create();
        $user->createToken('test');
        $otp = '123456';
        $newPassword = 'newpassword123';

        OtpService::shouldReceive('verify')->once()->with($user->email, $otp, OtpCode::TYPE_RESET_PASSWORD)->andReturn(true);

        AuthService::resetPassword($user->email, $otp, $newPassword);

        $user->refresh();
        $this->assertTrue(Hash::check($newPassword, $user->password));
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_reset_password_fails_with_invalid_otp(): void
    {
        $user = User::factory()->create();
        OtpService::shouldReceive('verify')->once()->andReturn(false);

        $this->expectException(ValidationException::class);

        AuthService::resetPassword($user->email, '000000', 'newpassword');
    }

    public function test_change_password_updates_password(): void
    {
        $currentPassword = 'oldpassword';
        $newPassword = 'newpassword123';
        $user = User::factory()->create(['password' => Hash::make($currentPassword)]);
        $user->createToken('other');
        $this->actingAs($user);

        AuthService::changePassword($user, $currentPassword, $newPassword);

        $user->refresh();
        $this->assertTrue(Hash::check($newPassword, $user->password));
    }

    public function test_change_password_fails_with_wrong_current_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        $this->actingAs($user);

        $this->expectException(ValidationException::class);

        AuthService::changePassword($user, 'wrongpassword', 'newpassword');
    }
}

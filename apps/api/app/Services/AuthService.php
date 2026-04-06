<?php

namespace App\Services;

use App\Models\User;
use App\Models\OtpCode;
use App\Notifications\OtpNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\OtpService;

class AuthService
{

    /**
     * Register a new user account.
     *
     * Creates the user without verifying email, generates OTP,
     * and sends verification email.
     */
    public static function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? User::ROLE_EMPLOYEE,
        ]);

        self::sendOtp($user->email, OtpCode::TYPE_REGISTER);

        return $user;
    }

    /**
     * Verify OTP and activate user account.
     *
     * @return array{user: User, access_token: string}
     */
    public static function verifyRegistrationOtp(string $email, string $otp): array
    {
        $verified = OtpService::verify($email, $otp, OtpCode::TYPE_REGISTER);

        if (! $verified) {
            throw ValidationException::withMessages([
                'otp' => [__('Kode OTP tidak valid atau sudah kedaluwarsa.')],
            ]);
        }

        $user = User::where('email', $email)->firstOrFail();
        $user->markEmailAsVerified();

        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Authenticate user with email and password.
     *
     * @return array{user: User, access_token: string}
     */
    public static function login(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [__('Email atau password salah.')],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if (! $user->hasVerifiedEmail()) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => [__('Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.')],
            ]);
        }

        // Revoke existing tokens and issue a new one
        $user->tokens()->delete();
        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Logout user by revoking all their tokens.
     */
    public static function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Refresh the user's access token.
     *
     * Revokes the current token and issues a new one.
     */
    public static function refreshToken(User $user): string
    {
        // Revoke current token
        $user->currentAccessToken()->delete();

        // Issue new token
        return $user->createToken('access_token')->plainTextToken;
    }

    /**
     * Initiate forgot password flow by sending OTP.
     */
    public static function forgotPassword(string $email): void
    {
        // Don't reveal whether user exists — always return success
        $user = User::where('email', $email)->first();

        if ($user) {
            self::sendOtp($email, OtpCode::TYPE_RESET_PASSWORD);
        }
    }

    /**
     * Reset password using OTP verification.
     */
    public static function resetPassword(string $email, string $otp, string $newPassword): void
    {
        $verified = OtpService::verify($email, $otp, OtpCode::TYPE_RESET_PASSWORD);

        if (! $verified) {
            throw ValidationException::withMessages([
                'otp' => [__('Kode OTP tidak valid atau sudah kedaluwarsa.')],
            ]);
        }

        $user = User::where('email', $email)->firstOrFail();
        $user->update(['password' => $newPassword]);

        // Revoke all existing tokens for security
        $user->tokens()->delete();
    }

    /**
     * Change password for authenticated user.
     */
    public static function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => [__('Password saat ini tidak sesuai.')],
            ]);
        }

        $user->update(['password' => $newPassword]);

        // Revoke all tokens except current
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();
    }

    /**
     * Send OTP to the given email.
     */
    public static function sendOtp(string $email, string $type): void
    {
        $code = OtpService::generate($email, $type);

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->notify(new OtpNotification($code, $type));
        }
    }
}
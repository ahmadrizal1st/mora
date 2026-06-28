<?php

namespace App\Services;

use App\Models\User;
use App\Models\OtpCode;
use App\Notifications\OtpNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\OtpService;
use Google_Client;

class AuthService
{

    
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

    
    public static function login(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [__('Email atau password salah.')],
            ]);
        }

        
        $user = Auth::user();

        if (! $user->hasVerifiedEmail()) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => [__('Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.')],
            ]);
        }

        
        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    
    public static function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    
    public static function refreshToken(User $user): string
    {
        
        $user->currentAccessToken()->delete();

        
        return $user->createToken('access_token')->plainTextToken;
    }

    
    public static function forgotPassword(string $email): void
    {
        
        $user = User::where('email', $email)->first();

        if ($user) {
            self::sendOtp($email, OtpCode::TYPE_RESET_PASSWORD);
        }
    }

    
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

        
        $user->tokens()->delete();
    }

    
    public static function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => [__('Password saat ini tidak sesuai.')],
            ]);
        }

        $user->update(['password' => $newPassword]);

        
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();
    }

    
    public static function loginWithGoogle(string $idToken): array
    {
        $client = new Google_Client(['client_id' => config('services.google.client_id')]);
        $payload = $client->verifyIdToken($idToken);

        if (! $payload) {
            throw ValidationException::withMessages([
                'credential' => [__('Token Google tidak valid atau sudah kedaluwarsa.')],
            ]);
        }

        $email = $payload['email'];
        $googleId = $payload['sub'];
        $name = $payload['name'];
        $avatar = $payload['picture'] ?? null;

        $user = User::where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if (! $user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'password' => Hash::make(str()->random(24)),
                'role' => User::ROLE_EMPLOYEE,
            ]);
            $user->markEmailAsVerified();
        } else {
            
            if (! $user->google_id) {
                $user->update(['google_id' => $googleId]);
            }
            
            if ($avatar && $user->avatar !== $avatar) {
                $user->update(['avatar' => $avatar]);
            }
        }

        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    
    public static function sendOtp(string $email, string $type): void
    {
        $code = OtpService::generate($email, $type);

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->notify(new OtpNotification($code, $type));
        }
    }
}
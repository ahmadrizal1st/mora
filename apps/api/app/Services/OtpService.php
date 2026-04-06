<?php

namespace App\Services;

use App\Models\OtpCode;
use Illuminate\Support\Facades\Hash;

class OtpService
{
    /**
     * OTP validity in minutes.
     */
    protected static int $expiresInMinutes = 10;

    /**
     * Generate a new OTP for the given email and type.
     *
     * Invalidates any existing active OTPs for the same email+type combination
     * before creating a new one.
     */
    public static function generate(string $email, string $type): string
    {
        // Invalidate existing active OTPs for this email+type
        OtpCode::forEmail($email)
            ->ofType($type)
            ->active()
            ->update(['expires_at' => now()]);

        // Generate 6-digit numeric code
        $plainCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store hashed code
        OtpCode::create([
            'email' => $email,
            'code' => Hash::make($plainCode),
            'type' => $type,
            'expires_at' => now()->addMinutes(self::$expiresInMinutes),
        ]);

        return $plainCode;
    }

    /**
     * Verify the given OTP code.
     *
     * Returns true and marks the OTP as verified if valid.
     * Returns false if no matching active OTP found or code doesn't match.
     */
    public static function verify(string $email, string $plainCode, string $type): bool
    {
        $otp = OtpCode::forEmail($email)
            ->ofType($type)
            ->active()
            ->latest()
            ->first();

        if (! $otp || ! $otp->verifyCode($plainCode)) {
            return false;
        }

        $otp->markAsVerified();

        return true;
    }

    /**
     * Clean up expired OTP records.
     */
    public static function cleanup(): int
    {
        return OtpCode::expired()->delete();
    }
}
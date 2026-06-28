<?php

namespace App\Services;

use App\Models\OtpCode;
use Illuminate\Support\Facades\Hash;

class OtpService
{
    
    protected static int $expiresInMinutes = 10;

    
    public static function generate(string $email, string $type): string
    {
        
        OtpCode::forEmail($email)
            ->ofType($type)
            ->active()
            ->update(['expires_at' => now()]);

        
        $plainCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        
        OtpCode::create([
            'email' => $email,
            'code' => Hash::make($plainCode),
            'type' => $type,
            'expires_at' => now()->addMinutes(self::$expiresInMinutes),
        ]);

        return $plainCode;
    }

    
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

    
    public static function cleanup(): int
    {
        return OtpCode::expired()->delete();
    }
}
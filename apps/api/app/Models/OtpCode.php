<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class OtpCode extends Model
{
    /**
     * OTP type constants.
     */
    public const TYPE_REGISTER = 'register';
    public const TYPE_RESET_PASSWORD = 'reset_password';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'code',
        'type',
        'expires_at',
        'verified_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Scope: filter by email.
     */
    public function scopeForEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    /**
     * Scope: filter by type.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope: only active (not expired, not verified) OTPs.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('expires_at', '>', now())
                     ->whereNull('verified_at');
    }

    /**
     * Scope: only expired OTPs.
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('expires_at', '<=', now());
    }

    /**
     * Check if this OTP has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if this OTP has been verified.
     */
    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    /**
     * Verify the given plain code against the stored hash.
     */
    public function verifyCode(string $plainCode): bool
    {
        return Hash::check($plainCode, $this->code);
    }

    /**
     * Mark this OTP as verified.
     */
    public function markAsVerified(): bool
    {
        return $this->update(['verified_at' => now()]);
    }
}

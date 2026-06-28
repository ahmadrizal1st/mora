<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class OtpCode extends Model
{
    
    public const TYPE_REGISTER = 'register';
    public const TYPE_RESET_PASSWORD = 'reset_password';

    
    protected $fillable = [
        'email',
        'code',
        'type',
        'expires_at',
        'verified_at',
    ];

    
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    
    public function scopeForEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('expires_at', '>', now())
                     ->whereNull('verified_at');
    }

    
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('expires_at', '<=', now());
    }

    
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    
    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    
    public function verifyCode(string $plainCode): bool
    {
        return Hash::check($plainCode, $this->code);
    }

    
    public function markAsVerified(): bool
    {
        return $this->update(['verified_at' => now()]);
    }
}

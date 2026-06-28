<?php

namespace App\Console\Commands;

use App\Models\OtpCode;
use Illuminate\Console\Command;

class CleanupExpiredOtps extends Command
{
    protected $signature = 'otp:cleanup';
    protected $description = 'Menghapus OTP yang sudah kedaluwarsa dari database';

    public function handle(): void
    {
        $deleted = OtpCode::expired()->delete();
        $this->info("Berhasil menghapus {$deleted} OTP yang kedaluwarsa.");
    }
}

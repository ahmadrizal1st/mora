<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            // Banks
            [
                'name' => 'BCA',
                'type' => 'bank',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
                'color' => '#0060af',
                'is_global' => true,
            ],
            [
                'name' => 'Mandiri',
                'type' => 'bank',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/f/fa/Bank_Mandiri_logo.svg',
                'color' => '#003d79',
                'is_global' => true,
            ],
            [
                'name' => 'BNI',
                'type' => 'bank',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg',
                'color' => '#f15a23',
                'is_global' => true,
            ],
            [
                'name' => 'BRI',
                'type' => 'bank',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_Logo.svg',
                'color' => '#00529c',
                'is_global' => true,
            ],
            [
                'name' => 'Bank Jago',
                'type' => 'bank',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Logo_Bank_Jago.svg',
                'color' => '#ff8c00',
                'is_global' => true,
            ],
            // E-Wallets
            [
                'name' => 'GoPay',
                'type' => 'ewallet',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
                'color' => '#00aed6',
                'is_global' => true,
            ],
            [
                'name' => 'OVO',
                'type' => 'ewallet',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
                'color' => '#4d2a86',
                'is_global' => true,
            ],
            [
                'name' => 'Dana',
                'type' => 'ewallet',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg',
                'color' => '#118eea',
                'is_global' => true,
            ],
            [
                'name' => 'ShopeePay',
                'type' => 'ewallet',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/f/fe/ShopeePay_logo.svg',
                'color' => '#ee4d2d',
                'is_global' => true,
            ],
        ];

        foreach ($providers as $provider) {
            Provider::create($provider);
        }
    }
}

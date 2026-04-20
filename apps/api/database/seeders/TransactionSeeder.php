<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Currency;
use App\Models\RecurringType;
use App\Models\Status;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            ['code' => 'IDR', 'symbol' => 'Rp', 'name' => 'Rupiah Indonesia', 'rate_to_idr' => 1, 'is_default' => true, 'is_active' => true],
            ['code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar', 'rate_to_idr' => 16500, 'is_default' => false, 'is_active' => true],
            ['code' => 'EUR', 'symbol' => '€', 'name' => 'Euro', 'rate_to_idr' => 18000, 'is_default' => false, 'is_active' => true],
            ['code' => 'SGD', 'symbol' => 'S$', 'name' => 'Singapore Dollar', 'rate_to_idr' => 12300, 'is_default' => false, 'is_active' => true],
            ['code' => 'MYR', 'symbol' => 'RM', 'name' => 'Malaysian Ringgit', 'rate_to_idr' => 3700, 'is_default' => false, 'is_active' => true],
        ];

        foreach ($currencies as $c) {
            Currency::updateOrCreate(['code' => $c['code']], $c);
        }

        $categories = [
            // Expense
            ['name' => 'Makanan & Minuman', 'tx_type' => 'expense', 'icon' => 'tools-kitchen-2', 'color' => '#e74c3c', 'is_default' => true],
            ['name' => 'Transportasi', 'tx_type' => 'expense', 'icon' => 'car', 'color' => '#3498db', 'is_default' => true],
            ['name' => 'Belanja', 'tx_type' => 'expense', 'icon' => 'shopping-cart', 'color' => '#9b59b6', 'is_default' => true],
            ['name' => 'Hiburan', 'tx_type' => 'expense', 'icon' => 'movie', 'color' => '#f39c12', 'is_default' => true],
            ['name' => 'Kesehatan', 'tx_type' => 'expense', 'icon' => 'heartbeat', 'color' => '#e91e63', 'is_default' => true],
            ['name' => 'Pendidikan', 'tx_type' => 'expense', 'icon' => 'school', 'color' => '#00bcd4', 'is_default' => true],
            ['name' => 'Tagihan & Utilitas', 'tx_type' => 'expense', 'icon' => 'receipt', 'color' => '#795548', 'is_default' => true],
            ['name' => 'Rumah Tangga', 'tx_type' => 'expense', 'icon' => 'home', 'color' => '#607d8b', 'is_default' => true],
            ['name' => 'Perawatan Diri', 'tx_type' => 'expense', 'icon' => 'user', 'color' => '#fd7e14', 'is_default' => true],
            ['name' => 'Asuransi', 'tx_type' => 'expense', 'icon' => 'shield-check', 'color' => '#20c997', 'is_default' => true],
            ['name' => 'Langganan', 'tx_type' => 'expense', 'icon' => 'refresh', 'color' => '#6610f2', 'is_default' => true],
            ['name' => 'Cicilan', 'tx_type' => 'expense', 'icon' => 'calendar-repeat', 'color' => '#d63384', 'is_default' => true],
            ['name' => 'Lainnya', 'tx_type' => 'expense', 'icon' => 'dots', 'color' => '#95a5a6', 'is_default' => true],

            // Income
            ['name' => 'Gaji', 'tx_type' => 'income', 'icon' => 'briefcase', 'color' => '#27ae60', 'is_default' => true],
            ['name' => 'Freelance', 'tx_type' => 'income', 'icon' => 'code', 'color' => '#2ecc71', 'is_default' => true],
            ['name' => 'Investasi', 'tx_type' => 'income', 'icon' => 'chart-line', 'color' => '#1abc9c', 'is_default' => true],
            ['name' => 'Hadiah', 'tx_type' => 'income', 'icon' => 'gift', 'color' => '#e67e22', 'is_default' => true],
            ['name' => 'Bonus', 'tx_type' => 'income', 'icon' => 'star', 'color' => '#f1c40f', 'is_default' => true],
            ['name' => 'Penjualan', 'tx_type' => 'income', 'icon' => 'tag', 'color' => '#d35400', 'is_default' => true],
            ['name' => 'Pendapatan Lainnya', 'tx_type' => 'income', 'icon' => 'cash', 'color' => '#16a085', 'is_default' => true],

            // Transfer
            ['name' => 'Transfer Antar Akun', 'tx_type' => 'transfer', 'icon' => 'arrows-right-left', 'color' => '#206bc4', 'is_default' => true],
        ];

        foreach ($categories as $c) {
            Category::updateOrCreate(
                ['name' => $c['name'], 'tx_type' => $c['tx_type']],
                $c
            );
        }

        $statuses = [
            ['name' => 'Completed', 'color' => '#27ae60'],
            ['name' => 'Pending', 'color' => '#f39c12'],
            ['name' => 'Cancelled', 'color' => '#e74c3c'],
        ];

        foreach ($statuses as $s) {
            Status::updateOrCreate(['name' => $s['name']], $s);
        }

        $recurringTypes = [
            ['name' => 'Harian', 'interval_days' => 1],
            ['name' => 'Mingguan', 'interval_days' => 7],
            ['name' => 'Bulanan', 'interval_days' => 30],
            ['name' => 'Tahunan', 'interval_days' => 365],
        ];

        foreach ($recurringTypes as $r) {
            RecurringType::updateOrCreate(['name' => $r['name']], $r);
        }

        // Create Tags for all users
        $users = User::all();
        $sampleTags = [
            ['name' => 'Penting', 'color' => '#e74c3c'],
            ['name' => 'Liburan', 'color' => '#3498db'],
            ['name' => 'Zakat', 'color' => '#27ae60'],
            ['name' => 'Hobi', 'color' => '#9b59b6'],
            ['name' => 'Kebutuhan', 'color' => '#607d8b'],
            ['name' => 'Investasi', 'color' => '#1abc9c'],
            ['name' => 'Bulanan', 'color' => '#6f42c1'],
            ['name' => 'Mendesak', 'color' => '#d63384'],
            ['name' => 'Keluarga', 'color' => '#20c997'],
            ['name' => 'Pribadi', 'color' => '#0d6efd'],
        ];

        foreach ($users as $user) {
            foreach ($sampleTags as $t) {
                Tag::updateOrCreate(
                    ['user_id' => $user->id, 'name' => $t['name']],
                    $t
                );
            }

            // Associate tags with user's transactions
            $userTags = Tag::where('user_id', $user->id)->get();
            $user->transactions()->each(function ($tx) use ($userTags) {
                // Randomly attach 0-3 tags to each transaction
                $randomTags = $userTags->random(rand(0, 3))->pluck('id');
                $tx->tags()->sync($randomTags);
            });
        }
    }
}

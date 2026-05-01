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
            ['code' => 'IDR', 'symbol' => 'Rp', 'name' => 'Rupiah Indonesia'],
            ['code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar'],
            ['code' => 'EUR', 'symbol' => '€', 'name' => 'Euro'],
            ['code' => 'SGD', 'symbol' => 'S$', 'name' => 'Singapore Dollar'],
            ['code' => 'MYR', 'symbol' => 'RM', 'name' => 'Malaysian Ringgit'],
        ];

        foreach ($currencies as $c) {
            Currency::updateOrCreate(['code' => $c['code']], $c);
        }

        $categories = [
            // Expense
            ['name' => 'Makanan & Minuman', 'type' => 'expense', 'icon' => 'tools-kitchen-2', 'color' => '#e74c3c'],
            ['name' => 'Transportasi', 'type' => 'expense', 'icon' => 'car', 'color' => '#3498db'],
            ['name' => 'Belanja', 'type' => 'expense', 'icon' => 'shopping-cart', 'color' => '#9b59b6'],
            ['name' => 'Hiburan', 'type' => 'expense', 'icon' => 'movie', 'color' => '#f39c12'],
            ['name' => 'Kesehatan', 'type' => 'expense', 'icon' => 'heartbeat', 'color' => '#e91e63'],
            ['name' => 'Pendidikan', 'type' => 'expense', 'icon' => 'school', 'color' => '#00bcd4'],
            ['name' => 'Tagihan & Utilitas', 'type' => 'expense', 'icon' => 'receipt', 'color' => '#795548'],
            ['name' => 'Rumah Tangga', 'type' => 'expense', 'icon' => 'home', 'color' => '#607d8b'],
            ['name' => 'Perawatan Diri', 'type' => 'expense', 'icon' => 'user', 'color' => '#fd7e14'],
            ['name' => 'Asuransi', 'type' => 'expense', 'icon' => 'shield-check', 'color' => '#20c997'],
            ['name' => 'Langganan', 'type' => 'expense', 'icon' => 'refresh', 'color' => '#6610f2'],
            ['name' => 'Cicilan', 'type' => 'expense', 'icon' => 'calendar-repeat', 'color' => '#d63384'],
            ['name' => 'Lainnya', 'type' => 'expense', 'icon' => 'dots', 'color' => '#95a5a6'],

            // Income
            ['name' => 'Gaji', 'type' => 'income', 'icon' => 'briefcase', 'color' => '#27ae60'],
            ['name' => 'Freelance', 'type' => 'income', 'icon' => 'code', 'color' => '#2ecc71'],
            ['name' => 'Investasi', 'type' => 'income', 'icon' => 'chart-line', 'color' => '#1abc9c'],
            ['name' => 'Hadiah', 'type' => 'income', 'icon' => 'gift', 'color' => '#e67e22'],
            ['name' => 'Bonus', 'type' => 'income', 'icon' => 'star', 'color' => '#f1c40f'],
            ['name' => 'Penjualan', 'type' => 'income', 'icon' => 'tag', 'color' => '#d35400'],
            ['name' => 'Pendapatan Lainnya', 'type' => 'income', 'icon' => 'cash', 'color' => '#16a085'],

            // Transfer
            ['name' => 'Transfer Antar Akun', 'type' => 'transfer', 'icon' => 'arrows-right-left', 'color' => '#206bc4'],
        ];

        foreach ($categories as $c) {
            Category::updateOrCreate(
                ['name' => $c['name'], 'type' => $c['type']],
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
            ['name' => 'Harian'],
            ['name' => 'Mingguan'],
            ['name' => 'Bulanan'],
            ['name' => 'Tahunan'],
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
                $count = $userTags->count();
                if ($count > 0) {
                    $randomTags = $userTags->random(min(rand(0, 3), $count))->pluck('id');
                    $tx->tags()->sync($randomTags);
                }
            });
        }
    }
}

<?php

namespace App\Services\Formats;

/**
 * Format Library — Indonesian & International E-Wallets
 *
 * HOW TO ADD A NEW E-WALLET:
 * 1. Add detection regex to PATTERNS
 * 2. Add format definition to FORMATS (same key)
 * 3. Test with a real export/screenshot document
 */
class EwalletFormats
{
    public const PATTERNS = [
        'gopay'     => '/\b(GoPay|GOPAY|Gojek)\b/i',
        'ovo'       => '/\b(OVO|ovo\.id)\b/i',
        'dana'      => '/\b(DANA|dana\.id)\b/i',
        'shopeepay' => '/\b(ShopeePay|Shopee Pay|SHOPEEPAY)\b/i',
        'linkaja'   => '/\b(LinkAja|LINKAJA|Link Aja)\b/i',
        'isaku'     => '/\b(iSaku|ISAKU)\b/i',
        'sakuku'    => '/\b(Sakuku|SAKUKU)\b/i',
        'flip'      => '/\b(Flip|FLIP|flip\.id)\b/i',
    ];

    public const FORMATS = [

        // ─────────────────────────────────────────────
        // GOPAY
        // ─────────────────────────────────────────────
        'gopay' => [
            'name'             => 'GoPay',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | JAM | KETERANGAN | JENIS | JUMLAH | SALDO',
            'debit_indicators' => ['Keluar', 'Pembayaran', 'Transfer', 'Tarik Tunai'],
            'credit_indicators'=> ['Masuk', 'Top Up', 'Cashback', 'Refund', 'GoPay Later'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'KETERANGAN: "Pembayaran ke [MERCHANT]" atau "GoPay [LAYANAN]"',
            'notes'            => 'GoPay: amount selalu positif. Gunakan kolom JENIS (Masuk/Keluar) untuk menentukan tipe transaksi.',
            'few_shot'         => [
                [
                    'input'  => "01/03/2024 09:15 | Pembayaran ke Indomaret | Keluar | 45.000 | 155.000",
                    'output' => '{"merchant":"Indomaret","date":"2024-03-01","amount":45000,"type":"expense","raw_type":"DB","category":"Belanja"}',
                ],
                [
                    'input'  => "02/03/2024 10:00 | Top Up GoPay via BCA | Masuk | 200.000 | 355.000",
                    'output' => '{"merchant":"Top Up GoPay","date":"2024-03-02","amount":200000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
                [
                    'input'  => "05/03/2024 19:30 | GoFood - Warung Padang | Keluar | 35.000 | 320.000",
                    'output' => '{"merchant":"Warung Padang","date":"2024-03-05","amount":35000,"type":"expense","raw_type":"DB","category":"Makanan & Minuman"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // OVO
        // ─────────────────────────────────────────────
        'ovo' => [
            'name'             => 'OVO',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | DESKRIPSI | TIPE | JUMLAH | SALDO',
            'debit_indicators' => ['Debit', 'Payment', 'Transfer Out', 'OVO Points Used'],
            'credit_indicators'=> ['Credit', 'Top Up', 'Refund', 'Transfer In', 'Cashback'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'DESKRIPSI: "OVO Payment - [MERCHANT]"',
            'notes'            => null,
            'few_shot'         => [
                [
                    'input'  => "15/01/2024 | OVO Payment - Alfamart | Payment | 32.500 | 267.500",
                    'output' => '{"merchant":"Alfamart","date":"2024-01-15","amount":32500,"type":"expense","raw_type":"DB","category":"Belanja"}',
                ],
                [
                    'input'  => "20/01/2024 | Top Up via BRI | Top Up | 100.000 | 367.500",
                    'output' => '{"merchant":"Top Up OVO","date":"2024-01-20","amount":100000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // DANA
        // ─────────────────────────────────────────────
        'dana' => [
            'name'             => 'DANA',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | NAMA TRANSAKSI | STATUS | DEBIT/KREDIT | SALDO',
            'debit_indicators' => ['Debit', 'Bayar', 'Kirim', 'Tarik'],
            'credit_indicators'=> ['Kredit', 'Terima', 'Top Up', 'Cashback', 'Refund'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'NAMA TRANSAKSI: "Bayar [MERCHANT]" atau "Kirim ke [NAMA]"',
            'notes'            => 'DANA menggunakan tanda minus (-) untuk debit dan plus (+) untuk kredit di beberapa format export.',
            'few_shot'         => [
                [
                    'input'  => "03/02/2024 | Bayar Shopee | Berhasil | -75.000 | 125.000",
                    'output' => '{"merchant":"Shopee","date":"2024-02-03","amount":75000,"type":"expense","raw_type":"DB","category":"Belanja"}',
                ],
                [
                    'input'  => "10/02/2024 | Top Up dari BNI | Berhasil | +300.000 | 425.000",
                    'output' => '{"merchant":"Top Up DANA","date":"2024-02-10","amount":300000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
                [
                    'input'  => "15/02/2024 | Kirim ke 081234567890 Andi | Berhasil | -50.000 | 375.000",
                    'output' => '{"merchant":"Andi","date":"2024-02-15","amount":50000,"type":"expense","raw_type":"DB","category":"Lainnya"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // SHOPEEPAY
        // ─────────────────────────────────────────────
        'shopeepay' => [
            'name'             => 'ShopeePay',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | DESKRIPSI | TIPE | JUMLAH | SALDO',
            'debit_indicators' => ['Keluar', 'Pembayaran', 'Tarik Dana'],
            'credit_indicators'=> ['Masuk', 'Top Up', 'Refund', 'Cashback', 'Pengembalian Dana'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'DESKRIPSI: nama toko Shopee atau "Pembayaran [MERCHANT]"',
            'notes'            => 'ShopeePay sering muncul di mutasi bank sebagai "SHOPEEPAY" atau "1229B/SHOPEEPAY".',
            'few_shot'         => [
                [
                    'input'  => "20/03/2024 | Pembayaran ke Toko Baju Murah | Keluar | 120.000 | 80.000",
                    'output' => '{"merchant":"Toko Baju Murah","date":"2024-03-20","amount":120000,"type":"expense","raw_type":"DB","category":"Belanja"}',
                ],
                [
                    'input'  => "22/03/2024 | Pengembalian Dana Order #SP123 | Masuk | 45.000 | 125.000",
                    'output' => '{"merchant":"Refund Shopee","date":"2024-03-22","amount":45000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // LINKAJA
        // ─────────────────────────────────────────────
        'linkaja' => [
            'name'             => 'LinkAja',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | KETERANGAN | TIPE | NOMINAL | SALDO',
            'debit_indicators' => ['Debet', 'Pembayaran', 'Transfer', 'Tarik'],
            'credit_indicators'=> ['Kredit', 'Isi Ulang', 'Refund', 'Cashback'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'KETERANGAN column',
            'notes'            => null,
            'few_shot'         => [],
        ],

        // ─────────────────────────────────────────────
        // FLIP
        // ─────────────────────────────────────────────
        'flip' => [
            'name'             => 'Flip',
            'category'         => 'ewallet',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | NAMA | BANK TUJUAN | NOMINAL | STATUS',
            'debit_indicators' => ['Berhasil', 'Diproses'],
            'credit_indicators'=> ['Masuk'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'NAMA: nama penerima transfer',
            'notes'            => 'Flip adalah layanan transfer antar bank gratis. Semua transaksi umumnya bersifat expense (transfer keluar).',
            'few_shot'         => [
                [
                    'input'  => "2024-03-01 | Siti Rahayu | BNI | 500.000 | Berhasil",
                    'output' => '{"merchant":"Siti Rahayu","date":"2024-03-01","amount":500000,"type":"expense","raw_type":"DB","category":"Lainnya"}',
                ],
            ],
        ],
    ];
}

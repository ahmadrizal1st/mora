<?php

namespace App\Services\Formats;

class BankFormats
{
    public const PATTERNS = [
        'bca'     => '/\b(BCA|Bank Central Asia|KLIK ?BCA|myBCA)\b/i',
        'mandiri' => '/\b(Mandiri|MANDIRI|LIVIN|Bank Mandiri)\b/i',
        'bni'     => '/\b(BNI|Bank Negara Indonesia|BNI Mobile)\b/i',
        'bri'     => '/\b(BRI|Bank Rakyat Indonesia|BRImo|BRIMO)\b/i',
        'cimb'    => '/\b(CIMB|CIMB Niaga|OCTO)\b/i',
        'permata' => '/\b(Permata|PermataMobile)\b/i',
        'danamon' => '/\b(Danamon|D-Mobile)\b/i',
        'bsi'     => '/\b(BSI|Bank Syariah Indonesia)\b/i',
        'jago'    => '/\b(Bank Jago)\b/i',
        'jenius'  => '/\b(Jenius|BTPN)\b/i',
        'seabank' => '/\b(SeaBank|Sea Bank)\b/i',
        'neo'     => '/\b(Neo Commerce|BNC|Bank Neo)\b/i',
    ];

    public const FORMATS = [

        
        
        
        'bca' => [
            'name'             => 'Bank BCA',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | KETERANGAN | CBG | MUTASI (DB/CR) | SALDO',
            'debit_indicators' => ['DB'],
            'credit_indicators'=> ['CR'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'Baris terakhir di KETERANGAN setelah kode referensi',
            'notes'            => 'BCA menggunakan kolom CBG (kode cabang). SALDO = kolom paling kanan, JANGAN dipakai sebagai amount.',
            'few_shot'         => [
                [
                    'input'  => "02/01 | TRSF E-BANKING CR\n0201/FTSCY/WS12345\n1000000.00\nBUDI SANTOSO | | 1.000.000,00 CR | 5.500.000,00",
                    'output' => '{"merchant":"Budi Santoso","date":"YYYY-01-02","amount":1000000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
                [
                    'input'  => "05/01 | BIAYA ADM | | 15.000,00 DB | 5.485.000,00",
                    'output' => '{"merchant":"Biaya Administrasi Bank","date":"YYYY-01-05","amount":15000,"type":"expense","raw_type":"DB","category":"Tagihan & Utilitas"}',
                ],
                [
                    'input'  => "10/01 | TRANSAKSI DEBIT\nTGL: 10/01\nQR 914\n00000.00MyTelkomsel | | 50.000,00 DB | 5.435.000,00",
                    'output' => '{"merchant":"MyTelkomsel","date":"YYYY-01-10","amount":50000,"type":"expense","raw_type":"DB","category":"Tagihan & Utilitas"}',
                ],
                [
                    'input'  => "29/03 | TRANSAKSI DEBIT\nTGL: 29/03\nQR 848\n00000.00Hostinger | | 170.065,00 DB | 314.935,00",
                    'output' => '{"merchant":"Hostinger","date":"YYYY-03-29","amount":170065,"type":"expense","raw_type":"DB","category":"Tagihan & Utilitas"}',
                ],
                [
                    'input'  => "31/03 | TRSF E-BANKING CR\n3003/FTSCY/WS95011\n500000.00\nTRI ROHMAWATI | | 500.000,00 CR | 734.435,00",
                    'output' => '{"merchant":"Tri Rohmawati","date":"YYYY-03-31","amount":500000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        
        
        
        'mandiri' => [
            'name'             => 'Bank Mandiri',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | KETERANGAN | DEBET | KREDIT | SALDO',
            'debit_indicators' => ['DEBET', 'DB', 'Debet'],
            'credit_indicators'=> ['KREDIT', 'CR', 'Kredit'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'KETERANGAN: "Transfer ke [NAMA]" atau "Pembelian [MERCHANT]"',
            'notes'            => 'Mandiri pisahkan kolom DEBET dan KREDIT. DEBET berisi nilai → expense. KREDIT berisi nilai → income. Salah satu pasti kosong.',
            'few_shot'         => [
                [
                    'input'  => "01/03/2024 | Transfer ke Rina Wati | 200.000,00 | | 3.800.000,00",
                    'output' => '{"merchant":"Rina Wati","date":"2024-03-01","amount":200000,"type":"expense","raw_type":"DB","category":"Lainnya"}',
                ],
                [
                    'input'  => "05/03/2024 | Gaji Maret 2024 PT Maju Bersama | | 8.500.000,00 | 12.300.000,00",
                    'output' => '{"merchant":"PT Maju Bersama","date":"2024-03-05","amount":8500000,"type":"income","raw_type":"CR","category":"Gaji"}',
                ],
                [
                    'input'  => "10/03/2024 | Biaya Adm Bulanan | 15.000,00 | | 12.285.000,00",
                    'output' => '{"merchant":"Biaya Administrasi Mandiri","date":"2024-03-10","amount":15000,"type":"expense","raw_type":"DB","category":"Tagihan & Utilitas"}',
                ],
            ],
        ],

        
        
        
        'bni' => [
            'name'             => 'Bank BNI',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TGL | KETERANGAN | DEBIT | KREDIT | SALDO',
            'debit_indicators' => ['D', 'DEBIT', 'Debit'],
            'credit_indicators'=> ['K', 'KREDIT', 'Kredit'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'KETERANGAN: format "TRF/[KODE]/[NAMA]"',
            'notes'            => null,
            'few_shot'         => [
                [
                    'input'  => "15/02 | TRF/BNIDC/2024/Ahmad Fauzi | 500.000,00 | | 2.100.000,00",
                    'output' => '{"merchant":"Ahmad Fauzi","date":"YYYY-02-15","amount":500000,"type":"expense","raw_type":"D","category":"Lainnya"}',
                ],
                [
                    'input'  => "20/02 | KRED/GAJI/PT SUKSES MAKMUR | | 6.000.000,00 | 8.100.000,00",
                    'output' => '{"merchant":"PT Sukses Makmur","date":"YYYY-02-20","amount":6000000,"type":"income","raw_type":"K","category":"Gaji"}',
                ],
            ],
        ],

        
        
        
        'bri' => [
            'name'             => 'Bank BRI',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TGL | KETERANGAN | DEBIT | KREDIT | SALDO',
            'debit_indicators' => ['DEBIT', 'Db'],
            'credit_indicators'=> ['KREDIT', 'Kr'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'KETERANGAN: "TRANSFER KE [NAMA]" atau "PEMBAYARAN [MERCHANT]"',
            'notes'            => null,
            'few_shot'         => [
                [
                    'input'  => "01/04 | TRANSFER KE WARUNG SARI | 75.000,00 | | 1.925.000,00",
                    'output' => '{"merchant":"Warung Sari","date":"YYYY-04-01","amount":75000,"type":"expense","raw_type":"DEBIT","category":"Makanan & Minuman"}',
                ],
                [
                    'input'  => "15/04 | SETOR TUNAI | | 1.000.000,00 | 2.925.000,00",
                    'output' => '{"merchant":"Setor Tunai BRI","date":"YYYY-04-15","amount":1000000,"type":"income","raw_type":"KREDIT","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        
        
        
        'cimb' => [
            'name'             => 'CIMB Niaga',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | KETERANGAN | DEBIT | KREDIT | SALDO',
            'debit_indicators' => ['DEBIT', 'Debit', 'D'],
            'credit_indicators'=> ['KREDIT', 'Kredit', 'K'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'KETERANGAN column',
            'notes'            => null,
            'few_shot'         => [],
        ],

        
        
        
        'jago' => [
            'name'             => 'Bank Jago',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | DESKRIPSI | JENIS | JUMLAH | SALDO',
            'debit_indicators' => ['Keluar', 'Pembayaran', 'Transfer Keluar'],
            'credit_indicators'=> ['Masuk', 'Top Up', 'Transfer Masuk'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'DESKRIPSI column — nama merchant atau nama tujuan transfer',
            'notes'            => 'Bank Jago adalah bank digital. Format PDF-nya berbeda dari bank konvensional.',
            'few_shot'         => [],
        ],

        
        
        
        'jenius' => [
            'name'             => 'Jenius (BTPN)',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | DESKRIPSI | JUMLAH | TIPE | SALDO',
            'debit_indicators' => ['-', 'Debit', 'Keluar'],
            'credit_indicators'=> ['+', 'Kredit', 'Masuk'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'DESKRIPSI: "Bayar ke [MERCHANT]" atau nama pengirim',
            'notes'            => 'Jenius menggunakan tanda + / - di depan angka untuk menandai income/expense.',
            'few_shot'         => [
                [
                    'input'  => "2024-03-10 | Bayar ke Tokopedia | -250.000 | Debit | 1.750.000",
                    'output' => '{"merchant":"Tokopedia","date":"2024-03-10","amount":250000,"type":"expense","raw_type":"DB","category":"Belanja"}',
                ],
                [
                    'input'  => "2024-03-15 | Terima dari Budi | +500.000 | Kredit | 2.250.000",
                    'output' => '{"merchant":"Budi","date":"2024-03-15","amount":500000,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        
        
        
        'bsi' => [
            'name'             => 'Bank Syariah Indonesia (BSI)',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | KETERANGAN | DEBET | KREDIT | SALDO',
            'debit_indicators' => ['DEBET', 'Db'],
            'credit_indicators'=> ['KREDIT', 'Kr'],
            'amount_format'    => 'dot_thousand_comma_decimal',
            'merchant_location'=> 'KETERANGAN column',
            'notes'            => null,
            'few_shot'         => [],
        ],

        
        
        
        'seabank' => [
            'name'             => 'SeaBank',
            'category'         => 'bank',
            'language'         => 'id',
            'column_order'     => 'TANGGAL | DESKRIPSI | TIPE | JUMLAH | SALDO',
            'debit_indicators' => ['Keluar', 'Debit', 'Pembayaran'],
            'credit_indicators'=> ['Masuk', 'Kredit', 'Top Up'],
            'amount_format'    => 'dot_thousand_no_decimal',
            'merchant_location'=> 'DESKRIPSI column',
            'notes'            => 'SeaBank adalah bank digital milik Sea Group (Shopee).',
            'few_shot'         => [],
        ],
    ];
}

<?php

namespace App\Services\Formats;

/**
 * Format Library — International Financial Institutions
 *
 * HOW TO ADD A NEW INSTITUTION:
 * 1. Add detection regex to PATTERNS
 * 2. Add format definition to FORMATS (same key)
 * 3. Note the language and amount format carefully
 */
class InternationalFormats
{
    public const PATTERNS = [
        'paypal'   => '/\b(PayPal|PAYPAL)\b/i',
        'wise'     => '/\b(Wise|TransferWise|Wise\.com)\b/i',
        'stripe'   => '/\b(Stripe|STRIPE)\b/i',
        'revolut'  => '/\b(Revolut|REVOLUT)\b/i',
        'airwallex'=> '/\b(Airwallex|AIRWALLEX)\b/i',
    ];

    public const FORMATS = [

        // ─────────────────────────────────────────────
        // WISE (TransferWise)
        // ─────────────────────────────────────────────
        'wise' => [
            'name'             => 'Wise (TransferWise)',
            'category'         => 'international',
            'language'         => 'en',
            'column_order'     => 'DATE | DESCRIPTION | AMOUNT | CURRENCY | BALANCE',
            'debit_indicators' => ['Sent', 'Paid', 'Withdrawn', 'Fee', 'Converted from'],
            'credit_indicators'=> ['Received', 'Added', 'Converted to', 'Refund'],
            'amount_format'    => 'comma_thousand_dot_decimal',
            'merchant_location'=> 'DESCRIPTION: "Sent to [NAME]" atau "Payment to [MERCHANT]"',
            'notes'            => 'Wise: amount bisa negatif untuk debit. Kolom CURRENCY berisi kode mata uang (USD, EUR, IDR). Satu akun bisa multi-currency.',
            'few_shot'         => [
                [
                    'input'  => "01 Jan 2024 | Sent to John Smith | -250.00 | USD | 1,250.00",
                    'output' => '{"merchant":"John Smith","date":"2024-01-01","amount":250,"type":"expense","raw_type":"DB","category":"Lainnya"}',
                ],
                [
                    'input'  => "05 Jan 2024 | Added money from Mandiri | +500.00 | USD | 1,750.00",
                    'output' => '{"merchant":"Bank Transfer","date":"2024-01-05","amount":500,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
                [
                    'input'  => "10 Jan 2024 | Wise fee | -2.50 | USD | 1,747.50",
                    'output' => '{"merchant":"Wise Fee","date":"2024-01-10","amount":2.5,"type":"expense","raw_type":"DB","category":"Tagihan & Utilitas"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // PAYPAL
        // ─────────────────────────────────────────────
        'paypal' => [
            'name'             => 'PayPal',
            'category'         => 'international',
            'language'         => 'en',
            'column_order'     => 'DATE | TIME | TIMEZONE | NAME | TYPE | STATUS | CURRENCY | AMOUNT | RECEIPT ID | BALANCE',
            'debit_indicators' => ['Payment Sent', 'Withdrawal', 'General Payment'],
            'credit_indicators'=> ['Payment Received', 'Add Funds', 'Refund', 'General Credit'],
            'amount_format'    => 'comma_thousand_dot_decimal',
            'merchant_location'=> 'NAME column (sender or recipient)',
            'notes'            => 'PayPal CSV export: amount negatif = debit/keluar, positif = kredit/masuk. Kolom STATUS harus "Completed" — abaikan transaksi "Pending" atau "Reversed".',
            'few_shot'         => [
                [
                    'input'  => "01/15/2024 | 09:30:00 | PST | Adobe Inc | Subscription Payment | Completed | USD | -29.99 | | 120.01",
                    'output' => '{"merchant":"Adobe Inc","date":"2024-01-15","amount":29.99,"type":"expense","raw_type":"DB","category":"Langganan"}',
                ],
                [
                    'input'  => "01/20/2024 | 14:00:00 | PST | Budi Setiawan | Payment Received | Completed | USD | 150.00 | | 270.01",
                    'output' => '{"merchant":"Budi Setiawan","date":"2024-01-20","amount":150,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // STRIPE
        // ─────────────────────────────────────────────
        'stripe' => [
            'name'             => 'Stripe',
            'category'         => 'international',
            'language'         => 'en',
            'column_order'     => 'ID | CREATED | AMOUNT | AMOUNT REFUNDED | CURRENCY | CONVERTED AMOUNT | DESCRIPTION | CUSTOMER',
            'debit_indicators' => ['Refund', 'Payout', 'Fee'],
            'credit_indicators'=> ['Charge', 'Payment'],
            'amount_format'    => 'comma_thousand_dot_decimal',
            'merchant_location'=> 'CUSTOMER atau DESCRIPTION column',
            'notes'            => 'Stripe: amount dalam cent untuk beberapa format (100 = $1.00). Cek currency dan konversi. Biasanya digunakan untuk menerima pembayaran (income).',
            'few_shot'         => [
                [
                    'input'  => "ch_xxx | 2024-03-01 | 50000 | 0 | idr | 50000 | Invoice #001 | customer@email.com",
                    'output' => '{"merchant":"customer@email.com","date":"2024-03-01","amount":50000,"type":"income","raw_type":"CR","category":"Penjualan"}',
                ],
            ],
        ],

        // ─────────────────────────────────────────────
        // REVOLUT
        // ─────────────────────────────────────────────
        'revolut' => [
            'name'             => 'Revolut',
            'category'         => 'international',
            'language'         => 'en',
            'column_order'     => 'DATE | DESCRIPTION | AMOUNT | CURRENCY | LOCAL AMOUNT | LOCAL CURRENCY | NOTES | BALANCE',
            'debit_indicators' => ['CARD_PAYMENT', 'TRANSFER', 'FEE'],
            'credit_indicators'=> ['TOPUP', 'CASHBACK', 'REFUND'],
            'amount_format'    => 'comma_thousand_dot_decimal',
            'merchant_location'=> 'DESCRIPTION column',
            'notes'            => 'Revolut: amount negatif = pengeluaran. Bisa multi-currency, gunakan CURRENCY column untuk konteks.',
            'few_shot'         => [
                [
                    'input'  => "2024-03-05 | Netflix | -15.99 | USD | -249,534 | IDR | | 84.01",
                    'output' => '{"merchant":"Netflix","date":"2024-03-05","amount":15.99,"type":"expense","raw_type":"DB","category":"Langganan"}',
                ],
                [
                    'input'  => "2024-03-10 | Top-Up by Mastercard | 200.00 | USD | 3,124,000 | IDR | | 284.01",
                    'output' => '{"merchant":"Top Up Revolut","date":"2024-03-10","amount":200,"type":"income","raw_type":"CR","category":"Pendapatan Lainnya"}',
                ],
            ],
        ],
    ];
}

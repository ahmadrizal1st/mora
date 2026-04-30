<?php

namespace App\Enums;

enum DocumentSchema: string
{
    case EXPENSE = 'expense';
    case INCOME = 'income';
    case RECEIPT = 'receipt';
    case INVOICE = 'invoice';
    case AUDIO_NOTE = 'audio_note';
    case AUTO = 'auto';

    /**
     * Get the expected data structure for the LLM extraction.
     *
     * @return array<string, mixed>
     */
    public function schema(): array
    {
        return match ($this) {
            self::EXPENSE, self::RECEIPT, self::INVOICE, self::AUDIO_NOTE, self::AUTO => [
                'transactions'   => [
                    [
                        'merchant_name'  => 'string | Clean name',
                        'date'           => 'string (YYYY-MM-DD)',
                        'amount'         => 'number | Total',
                        'category'       => 'string | ONE OF: Makanan & Minuman, Transportasi, Belanja, Hiburan, Kesehatan, Pendidikan, Tagihan & Utilitas, Rumah Tangga, Perawatan Diri, Asuransi, Langganan, Cicilan, Lainnya.',
                        'description'    => 'string | nullable',
                        'items'          => [['name' => 'string', 'price' => 'number']],
                        'payment_method' => 'string | nullable',
                        'currency'       => 'string | default IDR',
                        'type'           => 'string | "expense"',
                    ]
                ],
            ],

            self::INCOME => [
                'transactions'   => [
                    [
                        'source_name'    => 'string | Clean name',
                        'date'           => 'string (YYYY-MM-DD)',
                        'amount'         => 'number | Total',
                        'category'       => 'string | ONE OF: Gaji, Bonus, Freelance, Investasi, Hadiah, Penjualan, Pendapatan Lainnya.',
                        'description'    => 'string | nullable',
                        'items'          => [['name' => 'string', 'price' => 'number']],
                        'payment_method' => 'string | nullable',
                        'currency'       => 'string | default IDR',
                        'type'           => 'string | "income"',
                    ]
                ],
            ],
        };
    }
}

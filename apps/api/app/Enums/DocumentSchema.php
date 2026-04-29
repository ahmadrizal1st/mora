<?php

namespace App\Enums;

enum DocumentSchema: string
{
    case EXPENSE = 'expense';
    case INCOME = 'income';

    /**
     * Get the expected data structure for the LLM extraction.
     *
     * @return array<string, mixed>
     */
    public function schema(): array
    {
        return match ($this) {
            self::EXPENSE => [
                'merchant_name'  => 'string | CLEAN name of merchant or store. Remove filler words like "beli", "tambah", "ambil". Correct typos (e.g., "belimi" -> "Mie"). If no store is mentioned, use the main item name.',
                'date'           => 'string (YYYY-MM-DD) | date of transaction. Infer from context ("kemarin"=yesterday, "tadi"=today). Default to today if unknown.',
                'amount'         => 'number | The total sum of expenses as a FULL INTEGER (e.g., 10000, NOT 10.0). NEVER use decimal points.',
                'category'       => 'string | REQUIRED - Always infer from context. Use ONE of: Food, Transport, Shopping, Health, Education, Entertainment, Utilities, Household, Personal Care, Insurance, Subscription, Installment, Other. Examples: makan/minum=Food, bensin/parkir/ojek=Transport, obat/apotek/dokter=Health, les/kursus/sekolah=Education, netflix/spotify/langganan=Subscription, cicilan/angsuran/kredit=Installment, potong rambut/salon/barbershop=Personal Care, listrik/internet/pln/indihome=Utilities, belanja/toko=Shopping.',
                'description'    => 'string | nullable | brief description or note about the expense',
                'items'          => [
                    [
                        'name'  => 'string | CLEAN item name (e.g., "Mie Ayam" instead of "belimi ayam"). Remove "tambah", "sama", etc.',
                        'price' => 'number | FULL INTEGER price (e.g., 10000). NEVER use decimals like 10.0 or 15.5.',
                    ]
                ],
                'payment_method' => 'string | nullable | e.g. Cash, Transfer, QRIS, GoPay, OVO, Dana, Debit, Credit',
                'currency'       => 'string | currency code, default IDR if not mentioned',
            ],

            self::INCOME => [
                'source_name'    => 'string | CLEAN name of payer or income source (e.g., "Company Name", "Boss Name"). Remove "dapat", "masuk", "gaji".',
                'date'           => 'string (YYYY-MM-DD) | date of transaction. Infer from context. Default to today.',
                'amount'         => 'number | The total sum of income as a FULL INTEGER (e.g., 5000000). NEVER use decimal points.',
                'category'       => 'string | REQUIRED - Always infer from context. Use ONE of: Salary, Bonus, Freelance, Investment, Gift, Sales, Other Income. Examples: gaji=Salary, bonus/thr=Bonus, proyek/side job=Freelance, dividen/saham=Investment, kado/angpao=Gift, jualan=Sales.',
                'description'    => 'string | nullable | brief description or note about the income',
                'items'          => [
                    [
                        'name'  => 'string | CLEAN source/item name (e.g., "Gaji Pokok").',
                        'price' => 'number | FULL INTEGER price (e.g., 5000000). NEVER use decimals.',
                    ]
                ],
                'payment_method' => 'string | nullable | e.g. Transfer, Cash, Deposit',
                'currency'       => 'string | currency code, default IDR if not mentioned',
            ],
        };
    }
}

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
                'merchant_name'  => 'string | CLEAN name of merchant or store. Remove filler words like "beli", "tambah", "ambil". Correct typos (e.g., "starbuck" -> "Starbucks", "indomret" -> "Indomaret"). If no store is mentioned, use the main item name.',
                'date'           => 'string (YYYY-MM-DD) | date of transaction. Infer from context ("kemarin"=yesterday, "tadi"=today). Default to today if unknown.',
                'amount'         => 'number | The total amount from the "TOTAL" line in the document. This is your HIGHEST PRIORITY. Use the final value after discounts/taxes. FULL INTEGER only (e.g., 83700).',
                'category'       => 'string | REQUIRED - Always infer from context. Use ONE of: Food, Transport, Shopping, Health, Education, Entertainment, Utilities, Household, Personal Care, Insurance, Subscription, Installment, Other.',
                'description'    => 'string | nullable | brief description. If multiple transactions are found in one file (e.g. PDF/Excel list), mention it here but extract data for the primary/latest one.',
                'items'          => [
                    [
                        'name'  => 'string | CLEAN item name. IMPORTANT: Detect "Line Shifting". If an item (e.g. index 1.) has no price on its line, but the next line (index 2.) has a price that seems to belong to the first item, RE-ALIGN them. Prices in column-based receipts often shift down by one line.',
                        'price' => 'number | FULL INTEGER price. Match the price to the item it belongs to, even if it appears on the line below or next to the next item.',
                    ]
                ],
                'payment_method' => 'string | nullable | e.g. Cash, Transfer, QRIS, GoPay, OVO, Dana, Debit, Credit',
                'currency'       => 'string | currency code, default IDR if not mentioned',
                'type'           => 'string | REQUIRED - Use "expense" for spending and "income" for earnings/salary.',
            ],

            self::INCOME => [
                'source_name'    => 'string | CLEAN name of payer or income source. Correct typos (e.g., "Gadji" -> "Gaji").',
                'date'           => 'string (YYYY-MM-DD) | date of transaction. Default to today.',
                'amount'         => 'number | The total sum of income as a FULL INTEGER (e.g., 5000000).',
                'category'       => 'string | REQUIRED - Use ONE of: Salary, Bonus, Freelance, Investment, Gift, Sales, Other Income.',
                'description'    => 'string | nullable | If multiple entries found, extract the main/latest one and note it here.',
                'items'          => [
                    [
                        'name'  => 'string | CLEAN source/item name (e.g., "Gaji Pokok").',
                        'price' => 'number | FULL INTEGER price.',
                    ]
                ],
                'payment_method' => 'string | nullable | e.g. Transfer, Cash, Deposit',
                'currency'       => 'string | currency code, default IDR if not mentioned',
                'type'           => 'string | REQUIRED - Use "income" for earnings/salary and "expense" for spending.',
            ],
        };
    }
}

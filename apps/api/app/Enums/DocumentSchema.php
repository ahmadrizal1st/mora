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
                'tx' => [
                    [
                        'merchant'    => 'string',
                        'date'        => 'YYYY-MM-DD',
                        'amount'      => 'number',
                        'category'    => 'string',
                        'description' => 'string',
                        'items'       => [
                            ['name' => 'string', 'price' => 'number']
                        ],
                        'type'        => 'expense',
                    ]
                ],
            ],

            self::INCOME => [
                'tx' => [
                    [
                        'source'      => 'string',
                        'date'        => 'YYYY-MM-DD',
                        'amount'      => 'number',
                        'category'    => 'string',
                        'description' => 'string',
                        'type'        => 'income',
                    ]
                ],
            ],
        };
    }
}

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

    
    public function schema(): array
    {
        return match ($this) {
            self::EXPENSE, self::RECEIPT, self::INVOICE, self::AUDIO_NOTE, self::AUTO => [
                'tx' => [
                    [
                        'merchant'    => 'string',
                        'date'        => 'YYYY-MM-DD',
                        'amount'      => 'number (MUTASI column only, NOT SALDO)',
                        'type'        => 'income | expense',
                        'raw_type'    => 'DB | CR (original indicator from document)',
                        'category'    => 'string',
                        'description' => 'string',
                        'items'       => [
                            ['name' => 'string', 'price' => 'number', 'qty' => 'number']
                        ],
                    ]
                ],
            ],

            self::INCOME => [
                'tx' => [
                    [
                        'source'      => 'string',
                        'date'        => 'YYYY-MM-DD',
                        'amount'      => 'number (MUTASI column only, NOT SALDO)',
                        'type'        => 'income',
                        'raw_type'    => 'CR (original indicator from document)',
                        'category'    => 'string',
                        'description' => 'string',
                    ]
                ],
            ],
        };
    }
}

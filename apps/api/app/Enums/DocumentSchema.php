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
                'tx'   => [
                    [
                        'm'    => 'merchant',
                        'd'    => 'YYYY-MM-DD',
                        'a'    => 'number',
                        'c'    => 'category',
                        'desc' => 'string',
                        'pm'   => 'payment',
                        'cur'  => 'default IDR',
                        't'    => 'expense',
                    ]
                ],
            ],

            self::INCOME => [
                'tx'   => [
                    [
                        's'    => 'source',
                        'd'    => 'YYYY-MM-DD',
                        'a'    => 'number',
                        'c'    => 'category',
                        'desc' => 'string',
                        'pm'   => 'payment',
                        'cur'  => 'default IDR',
                        't'    => 'income',
                    ]
                ],
            ],
        };
    }
}

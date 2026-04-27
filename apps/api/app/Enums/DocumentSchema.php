<?php

namespace App\Enums;

enum DocumentSchema: string
{
    case INVOICE = 'invoice';
    case RECEIPT = 'receipt';
    case KTP = 'ktp';
    case AUDIO_NOTE = 'audio_note';

    /**
     * Get the expected data structure for the LLM extraction.
     *
     * @return array<string, mixed>
     */
    public function schema(): array
    {
        return match ($this) {
            self::INVOICE => [
                'invoice_number' => 'string | unique identifier of the invoice',
                'vendor_name' => 'string | name of the company issuing the invoice',
                'date' => 'string (YYYY-MM-DD) | date when the invoice was issued',
                'due_date' => 'string (YYYY-MM-DD) | nullable | deadline for payment',
                'items' => [
                    [
                        'description' => 'string | item description',
                        'quantity' => 'number | number of units',
                        'unit_price' => 'number | price per unit',
                        'total' => 'number | quantity * unit_price',
                    ]
                ],
                'subtotal' => 'number | total before tax',
                'tax_amount' => 'number | total tax applied',
                'total_amount' => 'number | final amount to be paid',
                'currency' => 'string (e.g., IDR, USD) | currency code',
            ],

            self::RECEIPT => [
                'merchant_name' => 'string | name of the store or merchant',
                'date' => 'string (YYYY-MM-DD) | date of transaction',
                'time' => 'string (HH:MM) | nullable | time of transaction',
                'items' => [
                    [
                        'name' => 'string | product or service name',
                        'price' => 'number | price of the item',
                    ]
                ],
                'total_amount' => 'number | total paid amount',
                'payment_method' => 'string | nullable | e.g., Cash, Credit Card, QRIS',
            ],

            self::KTP => [
                'nik' => 'string | 16 digit national identification number',
                'nama' => 'string | full name',
                'tempat_lahir' => 'string | place of birth',
                'tanggal_lahir' => 'string (YYYY-MM-DD) | date of birth',
                'jenis_kelamin' => 'string (LAKI-LAKI/PEREMPUAN) | gender',
                'alamat' => 'string | full address',
                'rt_rw' => 'string | neighborhood/hamlet numbers',
                'kelurahan_desa' => 'string | sub-district/village',
                'kecamatan' => 'string | district',
                'agama' => 'string | religion',
                'status_perkawinan' => 'string | marital status',
                'pekerjaan' => 'string | occupation',
                'kewarganegaraan' => 'string | nationality (e.g., WNI)',
                'berlaku_hingga' => 'string | validity period or SEUMUR HIDUP',
            ],

            self::AUDIO_NOTE => [
                'date' => 'string (YYYY-MM-DD) | date of the note',
                'speaker_name' => 'string | nullable | name of the person speaking',
                'transcription' => 'string | full text transcription of the audio',
                'summary' => 'string | concise summary of the note',
                'tags' => 'array of strings | relevant keywords or categories',
            ],
        };
    }
}

<?php

namespace App\Enums;

enum DocumentSchema: string
{
    case INVOICE = 'invoice';
    case RECEIPT = 'receipt';
    case KTP = 'ktp';
    case AUDIO_NOTE = 'audio_note';
    case EXPENSE = 'expense';

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

            self::EXPENSE => [
                'merchant_name'  => 'string | name of merchant, store, or payee. If unclear, use the item name.',
                'date'           => 'string (YYYY-MM-DD) | date of transaction. Infer from context ("kemarin"=yesterday, "tadi"=today). Default to today if unknown.',
                'amount'         => 'number | TOTAL transaction amount as integer. IMPORTANT: shorthand rules: "rb"/"ribu" after number = x1000 (e.g. 250rb=250000, 150rb=150000, 25rb=25000), "k" after number = x1000 (e.g. 10k=10000), "jt"/"juta" after number = x1000000. If multiple items, SUM all amounts.',
                'category'       => 'string | REQUIRED - Always infer from context. Use ONE of: Food, Transport, Shopping, Health, Education, Entertainment, Utilities, Household, Personal Care, Insurance, Subscription, Installment, Other. Examples: makan/minum=Food, bensin/parkir/ojek=Transport, obat/apotek/dokter=Health, les/kursus/sekolah=Education, netflix/spotify/langganan=Subscription, cicilan/angsuran/kredit=Installment, potong rambut/salon/barbershop=Personal Care, listrik/internet/pln/indihome=Utilities, belanja/toko=Shopping.',
                'description'    => 'string | nullable | brief description or note about the expense',
                'payment_method' => 'string | nullable | e.g. Cash, Transfer, QRIS, GoPay, OVO, Dana, Debit, Credit',
                'currency'       => 'string | currency code, default IDR if not mentioned',
            ],
        };
    }
}

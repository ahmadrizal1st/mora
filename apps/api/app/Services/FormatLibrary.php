<?php

namespace App\Services;

use App\Services\Formats\BankFormats;
use App\Services\Formats\EwalletFormats;
use App\Services\Formats\InternationalFormats;

class FormatLibrary
{
    
    private array $allPatterns;

    
    private array $allFormats;

    public function __construct()
    {
        
        $this->allPatterns = array_merge(
            BankFormats::PATTERNS,
            EwalletFormats::PATTERNS,
            InternationalFormats::PATTERNS,
        );

        $this->allFormats = array_merge(
            BankFormats::FORMATS,
            EwalletFormats::FORMATS,
            InternationalFormats::FORMATS,
            ['generic' => $this->genericFormat()],
        );
    }

    
    public function detect(string $rawText): string
    {
        foreach ($this->allPatterns as $key => $pattern) {
            if (preg_match($pattern, $rawText)) {
                return $key;
            }
        }

        return 'generic';
    }

    
    public function getFormat(string $key): array
    {
        return $this->allFormats[$key] ?? $this->genericFormat();
    }

    
    public function detectAndGetFormat(string $rawText): array
    {
        $key    = $this->detect($rawText);
        $format = $this->getFormat($key);

        return array_merge($format, ['detected_key' => $key]);
    }

    
    public function buildFormatContext(string $rawText): string
    {
        $info = $this->detectAndGetFormat($rawText);

        $lines = [];
        $lines[] = "INSTITUTION: {$info['name']} ({$info['detected_key']})";
        $lines[] = "COLUMNS: {$info['column_order']}";
        $lines[] = "EXPENSE(DB): " . implode(',', $info['debit_indicators']);
        $lines[] = "INCOME(CR): " . implode(',', $info['credit_indicators']);
        $lines[] = "MERCHANT: {$info['merchant_location']}";

        if (!empty($info['notes'])) {
            $lines[] = "NOTE: {$info['notes']}";
        }

        if (!empty($info['few_shot'])) {
            $lines[] = "EX:";
            
            $example = $info['few_shot'][0];
            $lines[] = "I:{$example['input']} O:{$example['output']}";
        }

        return implode("\n", $lines);
    }

    
    public function listSupported(): array
    {
        $result = [];
        foreach ($this->allFormats as $key => $format) {
            $result[] = [
                'key'      => $key,
                'name'     => $format['name'],
                'category' => $format['category'] ?? 'generic',
                'language' => $format['language'] ?? 'id/en',
            ];
        }
        return $result;
    }

    
    private function genericFormat(): array
    {
        return [
            'name'             => 'Generic Financial Document',
            'category'         => 'generic',
            'language'         => 'id/en',
            'column_order'     => 'DATE | DESCRIPTION | DEBIT/AMOUNT | CREDIT | BALANCE',
            'debit_indicators' => ['DB', 'DR', 'D', 'Debit', 'Debet', 'Keluar', 'Payment', 'Withdrawal', '-'],
            'credit_indicators'=> ['CR', 'C', 'K', 'Credit', 'Kredit', 'Masuk', 'Deposit', 'Top Up', '+'],
            'amount_format'    => 'auto_detect',
            'merchant_location'=> 'Description/Keterangan column — baris terakhir atau nama bermakna',
            'notes'            => null,
            'few_shot'         => [],
        ];
    }
}

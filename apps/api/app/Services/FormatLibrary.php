<?php

namespace App\Services;

use App\Services\Formats\BankFormats;
use App\Services\Formats\EwalletFormats;
use App\Services\Formats\InternationalFormats;

/**
 * FormatLibrary — Orchestrator
 *
 * Aggregates all format libraries (Bank, E-Wallet, International)
 * and provides detection + prompt context injection for the LLM.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  HOW TO ADD SUPPORT FOR A NEW INSTITUTION:          │
 * │  1. Choose the correct category file:               │
 * │     • Bank     → Services/Formats/BankFormats.php   │
 * │     • E-Wallet → Services/Formats/EwalletFormats.php│
 * │     • Intl     → Services/Formats/InternationalFormats.php │
 * │  2. Add regex to PATTERNS[]                         │
 * │  3. Add format definition to FORMATS[]              │
 * │  That's it — this orchestrator picks it up auto.    │
 * └─────────────────────────────────────────────────────┘
 */
class FormatLibrary
{
    /**
     * Priority-ordered detection: Bank → Ewallet → International
     * (longer/more specific matches should go first within each group)
     */
    private array $allPatterns;

    /**
     * Merged format definitions from all categories.
     */
    private array $allFormats;

    public function __construct()
    {
        // Merge all patterns — Bank checked first, then Ewallet, then International
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

    /**
     * Detect the institution key from raw OCR text.
     * Returns e.g. 'bca', 'gopay', 'wise', or 'generic'.
     */
    public function detect(string $rawText): string
    {
        foreach ($this->allPatterns as $key => $pattern) {
            if (preg_match($pattern, $rawText)) {
                return $key;
            }
        }

        return 'generic';
    }

    /**
     * Get format definition for a given key.
     */
    public function getFormat(string $key): array
    {
        return $this->allFormats[$key] ?? $this->genericFormat();
    }

    /**
     * Detect institution and return its format in one call.
     */
    public function detectAndGetFormat(string $rawText): array
    {
        $key    = $this->detect($rawText);
        $format = $this->getFormat($key);

        return array_merge($format, ['detected_key' => $key]);
    }

    /**
     * Build a structured string to inject into the LLM prompt.
     * Contains: detected institution name, column layout,
     * debit/credit indicators, amount format, and few-shot examples.
     */
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
            // Hanya ambil 1 contoh saja untuk menghemat token
            $example = $info['few_shot'][0];
            $lines[] = "I:{$example['input']} O:{$example['output']}";
        }

        return implode("\n", $lines);
    }

    /**
     * List all supported institutions (useful for UI or debugging).
     */
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

    /**
     * Generic/fallback format when institution cannot be detected.
     */
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

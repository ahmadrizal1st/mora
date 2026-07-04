<?php

namespace App\Services;

use App\Services\FormatLibrary;
use Illuminate\Support\Facades\Log;

class PromptBuilder
{
    public function build(string $rawText, string $schemaJson, string $docType): string
    {
        
        
        $receiptKeywords = '/(?:Total|TOTAL|Grand Total|SUM|Bayar|Amount Due|Netto|Invoice|Struk|Bill|Tagihan|Nominal|Rp\.|IDR|@| x )/i';
        $isReceipt = preg_match($receiptKeywords, $rawText);
        
        
        $hasPricePattern = preg_match('/\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\b/', $rawText);

        $mode = 'MULTIPLE'; 
        if ($isReceipt && $hasPricePattern) {
            $mode = 'SINGLE';
        }

        Log::info("PromptBuilder: Detected mode {$mode} for input text (Length: " . strlen($rawText) . ")");

        $formatContext = "";
        if ($mode === 'MULTIPLE') {
            $formatContext = app(FormatLibrary::class)->buildFormatContext($rawText);
        }

        if ($mode === 'SINGLE') {
            $logic = "MODE: SINGLE TRANSACTION (Receipt/Invoice/Shopping List)
- REQUIRED: Return EXACTLY ONE transaction object in the 'tx' array.
- TOTAL: Prioritize finding the 'Total' or final amount.
- MERCHANT: Identify the store name. IGNORE watermarks (e.g., Lemon8, CamScanner) or social media handles (@). If no store name exists, infer from context (e.g., 'Daftar Belanja', 'Toko Kelontong').
- ITEMS: Put all individual products into the 'items' array.";
        } else {
            $logic = "MODE: MULTIPLE TRANSACTIONS (Bank/E-Wallet Statement)
- Extract EVERY transaction row as a separate entry in 'tx'.
- Indicators: DB/Debit/Out is expense, CR/Credit/In is income.";
        }

        return <<<PROMPT
Role: Financial Extraction Expert. Output: RAW JSON ONLY.
Schema: {$schemaJson}

## STRICT RULES:
{$logic}
- REPLY: ALWAYS provide a friendly conversational response in the 'reply' field. If the user just says "Halo" or asks a question without a transaction, greet them back warmly and explain what you can do (record income/expense). If they provide a transaction, confirm it enthusiastically.
- DATE: Always YYYY-MM-DD. Use today if unknown: 2026-05-02.
- NO COMMENTS: Do not include "//" or explanations.
- AMOUNT: Clean integer (no dots/commas). Example: 334000.
- JSON: Ensure valid syntax, no trailing commas.

Input Text:
{$rawText}
PROMPT;
    }
}

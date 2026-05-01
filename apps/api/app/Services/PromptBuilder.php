<?php

namespace App\Services;

class PromptBuilder
{
    /**
     * Build the prompt for LLM extraction.
     *
     * @param string $rawText The text extracted from OCR.
     * @param array $schema The expected structure (from DocumentSchema enum).
     * @param string $docType The label of the document.
     * @return string
     */
    public function build(string $rawText, array $schema, string $docType, bool $isTextInput = false): string
    {
        $schemaJson = json_encode($schema);

        return <<<PROMPT
You are a financial parser. Extract transactions into this JSON schema: {$schemaJson}

DOCUMENT TYPES:
- TEXT/IMAGE/AUDIO: Always 1 transaction. IMPORTANT: The 'tx' array MUST have exactly ONE entry.
- RECEIPT/INVOICE: Group ALL items into ONE transaction. Put items in the 'items' array, NOT in separate 'tx' entries.
- STATEMENT/MUTASI: Multiple transactions allowed. Extract each row as a separate 'tx' entry.

## BANK STATEMENT & E-WALLET RULES:
1. **COLUMN MAPPING**: TANGGAL, DESCRIPTION/KETERANGAN, AMOUNT/MUTASI, SALDO/BALANCE (NEVER use Saldo as amount).
2. **TYPE**: Expense (DB, Debit, negative, or withdrawal keywords) | Income (CR, Kredit, positive, or deposit keywords).
3. **MERCHANT**: Extract from QR descriptions, transfer names, or e-wallet history details.

## HANDWRITTEN & RECEIPT RULES (CRITICAL):
1. **THE TOTAL RULE**: If you see a list (grocery/handwritten) with a "TOTAL" at the bottom, the ONLY 'amount' for the transaction is that TOTAL.
2. **NO SPLITTING**: DO NOT create multiple transactions for a list of items. 'tx' array MUST have only 1 entry.
3. **NOTES**: Put all individual items into the 'items' array; they will automatically be moved to 'notes'.
4. **MERCHANT CLEANING**: Extract the clean STORE NAME or PERSON NAME. Remove OCR noise, weird characters, or numbers that don't belong. Fix common typos (e.g., "Indomaret" instead of "Indomar3t").
5. **IGNORE WATERMARKS**: DO NOT use watermarks (like "Lemon8", "Canva", "@username", or app logos) as the merchant name. If no store name is found, use "Belanja".
6. **FLEXIBLE SEARCH**: If the merchant name is inside a sentence (e.g., "Transfer ke Budi Santoso" or "QRIS - Warung Ibu"), extract only the name ("Budi Santoso" or "Warung Ibu").

PROHIBITED:
- NO splitting a single receipt into multiple transactions.
- NO using individual item prices as the main transaction amount.
- NEVER use SALDO (balance) column values as amounts.

TYPE CLASSIFICATION (Fallback):
1. BALANCE DELTA: Incr = income | Decr = expense.
2. E-WALLET: Top-up = income | Payment/Transfer = expense.
3. BANK: DB/DR/D = expense | CR/C/K/KREDIT = income.

EXTRACTION RULES:
1. Output ONLY valid JSON (no markdown blocks or text).
2. DATE: YYYY-MM-DD.
3. AMOUNT: Number only (e.g. "10.000" -> 10000). Use dot for decimals.
4. ITEMS: Extract item name, price, and qty.
5. MULTIPLE: For statements/histories, extract ALL individual transactions.
6. COMPACT: Omit null/unknown fields.

Input:
{$rawText}
PROMPT;
    }
}

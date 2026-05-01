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

TYPE CLASSIFICATION (income vs expense):
1. BALANCE DELTA (Highest Priority):
   - Balance increases = income | Balance decreases = expense
2. COLUMN HEADERS:
   - Statements often use 2 columns: DEBET/DB/D (expense) vs KREDIT/CR/C/K (income).
3. DEBIT/EXPENSE Indicators:
   - Suffix: DB, DR, D (e.g., 50000 DB).
   - Keywords: PEMBELIAN, PURCHASE, WITHDRAWAL, TARIK TUNAI, BIAYA, TRANSFER KELUAR, ADMIN, PENALTY.
   - E-Wallet TopUp: GOPAY TOPUP, OVO TOP UP, DANA TOP UP, SHOPEEPAY, LINKAJA.
   - Bills/Merchants: PLN, BPJS, TELKOM, TOKOPEDIA, SHOPEE, LAZADA.
4. CREDIT/INCOME Indicators:
   - Suffix: CR, C, K, KREDIT (or NO suffix like BCA).
   - Keywords: SETORAN, TRANSFER MASUK, INCOMING, REFUND, CASHBACK, REWARD.
   - E-Wallet Cashout: GoPay Bank Transfer, DOMPET ANAK BANGSA, AIRPAY INTERNATION, OVO Cash Masuk, Tarik Saldo DANA.
5. EDGE CASES:
   - "BIF TRANSFER DR" = income (incoming BI-FAST).
   - Refund/Cashback = income.
   - Admin Fee/Tax = expense.
   - Ambiguous? Check balance. If still unsure, label "unknown".

EXTRACTION RULES:
1. Output ONLY valid JSON (no markdown blocks or text).
2. DATE: YYYY-MM-DD.
3. AMOUNT: Number only (e.g. "10.000" -> 10000). Use dot for decimals.
4. ITEMS: Extract item name, price, and qty.
5. MULTIPLE: Extract ALL transactions into the 'tx' array.
6. COMPACT: Omit null/unknown fields.

Input:
{$rawText}
PROMPT;
    }
}

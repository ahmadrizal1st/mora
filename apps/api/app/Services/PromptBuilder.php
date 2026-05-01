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
Extract transactions from the text below into the provided JSON schema.
Schema: {$schemaJson}

Input:
{$rawText}

Rules:
1. Output ONLY valid JSON. No conversational filler.
2. DATE: Must use YYYY-MM-DD.
3. AMOUNT: Number only. If currency is IDR and value looks like '10.000', treat it as 10000. Use dot (.) for decimal.
4. ITEMS: Extract each item name and its price into the 'items' array.
5. COMPACT: Omit fields that are null or unknown.
6. LANGUAGE: Input may be in Indonesian or English. Extract merchant names accurately.
7. MULTIPLE: If multiple receipts/transactions exist in one text, extract all of them into the 'tx' array.
PROMPT;
    }
}

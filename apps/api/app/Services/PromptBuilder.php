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
1. Output ONLY valid JSON.
2. DATE: YYYY-MM-DD.
3. AMOUNT: Number only, use dot (.) as decimal separator, NO thousand separators (e.g., 12500.50).
4. MULTIPLE: Extract every row/item found in the input. Do not omit any.
5. TABLES: Columns are separated by ' | '.
PROMPT;
    }
}

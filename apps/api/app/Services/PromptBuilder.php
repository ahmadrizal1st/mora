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
        $schemaJson = json_encode($schema, JSON_PRETTY_PRINT);

        $sourceContext = $isTextInput
            ? "The input below is a casual/informal user-typed text or note (e.g., in Bahasa Indonesia). It may contain shorthand amounts like '10k' (= 10000), '25rb' (= 25000), '1jt' (= 1000000). Parse them into proper numeric values."
            : "The input below is extracted from an OCR scan. It may contain typos or formatting artifacts.";

        return <<<PROMPT
You are a highly accurate data extraction agent. 
Your goal is to transform unstructured text into a clean, structured JSON object.

### DOCUMENT CONTEXT
Document Type: {$docType}
{$sourceContext}

### EXTRACTION SCHEMA
Please extract the data following this JSON structure. Values in the schema are descriptions of what to look for:
{$schemaJson}

### INPUT TEXT
---
{$rawText}
---

### CONSTRAINTS & FORMATTING
1. Output MUST be valid JSON only.
2. Do NOT wrap the JSON in markdown code blocks (no ```json).
3. Do NOT include any introductory or concluding text. Just the JSON object.
4. DATE FORMAT: Always use 'YYYY-MM-DD'. If no date is mentioned, use today's date.
5. NUMBER FORMAT: Ensure amounts are numeric (float/int), not strings. Convert shorthand: 'k'/'rb' = x1000, 'jt' = x1000000.
6. NULLABLE: If a field is described as 'nullable' and the information is not present, return null.
7. ACCURACY: If uncertain about a field, do your best based on context but do not hallucinate non-existent data.
8. MULTIPLE ITEMS: If the text mentions multiple purchases (e.g., "mie ayam 10k sama es teh 3k"), sum them all into the 'amount' field and use the most prominent merchant name.

Proceed with the extraction:
PROMPT;
    }
}

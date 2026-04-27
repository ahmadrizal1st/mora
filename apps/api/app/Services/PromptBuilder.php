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
    public function build(string $rawText, array $schema, string $docType): string
    {
        $schemaJson = json_encode($schema, JSON_PRETTY_PRINT);

        return <<<PROMPT
You are a highly accurate data extraction agent specializing in OCR results. 
Your goal is to transform messy, unstructured text into a clean, structured JSON object.

### DOCUMENT CONTEXT
Document Type: {$docType}

### EXTRACTION SCHEMA
Please extract the data following this JSON structure. Values in the schema are descriptions of what to look for:
{$schemaJson}

### RAW OCR TEXT
---
{$rawText}
---

### CONSTRAINTS & FORMATTING
1. Output MUST be valid JSON only.
2. Do NOT wrap the JSON in markdown code blocks (no ```json).
3. Do NOT include any introductory or concluding text. Just the JSON object.
4. DATE FORMAT: Always use 'YYYY-MM-DD'.
5. NUMBER FORMAT: Ensure totals, prices, and quantities are numeric (float/int), not strings.
6. NULLABLE: If a field is described as 'nullable' and the information is not present, return null.
7. ACCURACY: If you are uncertain about a specific field, do your best based on context but do not hallucinate non-existent data.

Proceed with the extraction:
PROMPT;
    }
}

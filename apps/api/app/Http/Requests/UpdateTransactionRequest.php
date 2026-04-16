<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['sometimes', 'in:income,expense,transfer'],
            'amount_raw' => ['sometimes', 'integer', 'min:1'],
            'currency_id' => ['nullable', 'integer', 'exists:currencies,id'],
            'rate_snapshot' => ['nullable', 'numeric', 'min:0'],
            'amount_in_default' => ['nullable', 'numeric', 'min:0'],
            'account_id' => ['sometimes', 'integer', 'exists:accounts,id'],
            'to_account_id' => ['nullable', 'integer', 'exists:accounts,id', 'different:account_id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'status_id' => ['nullable', 'integer', 'exists:statuses,id'],
            'recurring_type_id' => ['nullable', 'integer', 'exists:recurring_types,id'],
            'tx_date' => ['sometimes', 'date'],
            'merchant' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'dynamic_fields' => ['nullable', 'array'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}

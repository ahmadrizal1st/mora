<?php

namespace App\Http\Requests;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
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
        $types = implode(',', [
            Account::TYPE_CASH,
            Account::TYPE_BANK,
            Account::TYPE_EWALLET,
            Account::TYPE_INVESTMENT,
        ]);

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'currency_id' => ['sometimes', 'uuid', 'exists:currencies,id'],
            'provider_id' => ['nullable', 'uuid', 'exists:providers,id'],
            'color' => ['nullable', 'string', 'max:20'],
            'account_type' => ['sometimes', "in:{$types}"],
            'is_archived' => ['sometimes', 'boolean'],
        ];
    }
}

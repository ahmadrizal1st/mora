<?php

namespace App\Http\Requests;

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
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'currency_id' => ['sometimes', 'integer', 'exists:currencies,id'],
            'color' => ['nullable', 'string', 'max:20'],
            'type' => ['sometimes', 'in:cash,bank,e-wallet,investment'],
        ];
    }
}

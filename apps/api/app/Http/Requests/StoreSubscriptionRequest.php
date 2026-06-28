<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'next_billing_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
            'account_id' => ['nullable', 'uuid', 'exists:accounts,id'],
            'currency_id' => ['nullable', 'uuid', 'exists:currencies,id'],
            'auto_renew' => ['nullable', 'boolean'],
            'billing_cycle' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama langganan wajib diisi.',
            'amount.required' => 'Jumlah wajib diisi.',
            'next_billing_date.required' => 'Tanggal tagihan selanjutnya wajib diisi.',
        ];
    }
}

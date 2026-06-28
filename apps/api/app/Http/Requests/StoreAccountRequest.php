<?php

namespace App\Http\Requests;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        $types = implode(',', [
            Account::TYPE_CASH,
            Account::TYPE_BANK,
            Account::TYPE_EWALLET,
            Account::TYPE_INVESTMENT,
        ]);

        return [
            'name' => ['required', 'string', 'max:255'],
            'currency_id' => ['required', 'uuid', 'exists:currencies,id'],
            'provider_id' => ['nullable', 'uuid', 'exists:providers,id'],
            'color' => ['nullable', 'string', 'max:20'],
            'logo' => ['nullable', 'string', 'max:500'],
            'account_type' => ['required', "in:{$types}"],
        ];
    }

    
    public function messages(): array
    {
        return [
            'name.required' => 'Nama akun wajib diisi.',
            'currency_id.required' => 'Mata uang wajib dipilih.',
            'account_type.required' => 'Tipe akun wajib dipilih.',
            'account_type.in' => 'Tipe akun harus cash, bank, e-wallet, atau investment.',
        ];
    }
}

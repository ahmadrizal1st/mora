<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'currency_id' => ['required', 'integer', 'exists:currencies,id'],
            'color' => ['nullable', 'string', 'max:20'],
            'type' => ['required', 'in:cash,bank,e-wallet,investment'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama akun wajib diisi.',
            'currency_id.required' => 'Mata uang wajib dipilih.',
            'type.required' => 'Tipe akun wajib dipilih.',
            'type.in' => 'Tipe akun harus cash, bank, e-wallet, atau investment.',
        ];
    }
}

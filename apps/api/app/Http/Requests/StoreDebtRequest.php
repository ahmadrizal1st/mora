<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDebtRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'person_name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:utang,piutang'],
            'amount' => ['required', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
            'priority' => ['nullable', 'string', 'max:50'],
            'due_date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'person_name.required' => 'Nama orang wajib diisi.',
            'type.required' => 'Tipe (utang/piutang) wajib dipilih.',
            'type.in' => 'Tipe harus utang atau piutang.',
            'amount.required' => 'Jumlah wajib diisi.',
            'due_date.required' => 'Tanggal jatuh tempo wajib diisi.',
        ];
    }
}

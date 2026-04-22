<?php

namespace App\Http\Requests;

use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            Transaction::TYPE_INCOME,
            Transaction::TYPE_EXPENSE,
            Transaction::TYPE_TRANSFER,
        ]);

        return [
            'type' => ['required', "in:{$types}"],
            'amount_raw' => ['required', 'integer', 'min:1'],
            'currency_id' => ['nullable', 'integer', 'exists:currencies,id'],
            'rate_snapshot' => ['nullable', 'numeric', 'min:0'],
            'amount_in_default' => ['nullable', 'numeric', 'min:0'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'to_account_id' => ['nullable', 'required_if:type,transfer', 'integer', 'exists:accounts,id', 'different:account_id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'status_id' => ['nullable', 'integer', 'exists:statuses,id'],
            'recurring_type_id' => ['nullable', 'integer', 'exists:recurring_types,id'],
            'tx_date' => ['required', 'date'],
            'merchant' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'dynamic_fields' => ['nullable', 'array'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Tipe transaksi wajib diisi.',
            'type.in' => 'Tipe transaksi harus income, expense, atau transfer.',
            'amount_raw.required' => 'Nominal transaksi wajib diisi.',
            'amount_raw.min' => 'Nominal transaksi minimal 1.',
            'account_id.required' => 'Akun wajib dipilih.',
            'to_account_id.required_if' => 'Akun tujuan wajib diisi untuk transfer.',
            'to_account_id.different' => 'Akun tujuan tidak boleh sama dengan akun asal.',
            'tx_date.required' => 'Tanggal transaksi wajib diisi.',
        ];
    }
}

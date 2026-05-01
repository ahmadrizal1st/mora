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
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency_id' => ['nullable', 'uuid', 'exists:currencies,id'],
            'exchange_rate' => ['nullable', 'numeric', 'min:0'],
            'account_id' => ['required', 'uuid', 'exists:accounts,id'],
            'to_account_id' => ['nullable', 'required_if:type,transfer', 'uuid', 'exists:accounts,id', 'different:account_id'],
            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'status_id' => ['nullable', 'uuid', 'exists:statuses,id'],
            'recurring_type_id' => ['nullable', 'uuid', 'exists:recurring_types,id'],
            'budget_item_id' => ['nullable', 'uuid', 'exists:budget_items,id'],
            'document_extraction_id' => ['nullable', 'uuid', 'exists:document_extractions,id'],
            'split_bill_id' => ['nullable', 'uuid', 'exists:split_bills,id'],
            'tx_date' => ['required', 'date'],
            'input_method' => ['nullable', 'string', 'max:20'],
            'merchant' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'dynamic_fields' => ['nullable', 'array'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['uuid', 'exists:tags,id'],
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
            'amount.required' => 'Nominal transaksi wajib diisi.',
            'amount.min' => 'Nominal transaksi minimal 0.01.',
            'account_id.required' => 'Akun wajib dipilih.',
            'to_account_id.required_if' => 'Akun tujuan wajib diisi untuk transfer.',
            'to_account_id.different' => 'Akun tujuan tidak boleh sama dengan akun asal.',
            'tx_date.required' => 'Tanggal transaksi wajib diisi.',
        ];
    }
}

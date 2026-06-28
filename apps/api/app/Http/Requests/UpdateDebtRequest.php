<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDebtRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'person_name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:utang,piutang'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
            'priority' => ['nullable', 'string', 'max:50'],
            'due_date' => ['sometimes', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }
}

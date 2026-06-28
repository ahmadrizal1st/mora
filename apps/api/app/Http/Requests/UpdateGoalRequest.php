<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'target_amount' => ['sometimes', 'numeric', 'min:0'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
            'monthly_deposit' => ['nullable', 'numeric', 'min:0'],
            'deadline_date' => ['nullable', 'date'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'linked_account_id' => ['nullable', 'uuid', 'exists:accounts,id'],
            'currency_id' => ['nullable', 'uuid', 'exists:currencies,id'],
            'type' => ['nullable', 'string', 'max:100'],
        ];
    }
}

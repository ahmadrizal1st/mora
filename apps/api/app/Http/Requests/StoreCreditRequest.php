<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCreditRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'account_id' => 'nullable|uuid|exists:accounts,id',
            'type' => 'required|string|in:mortgage,personal,paylater,credit_card',
            'provider_name' => 'required|string|max:255',
            'principal_amount' => 'required|numeric|min:0',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'tenor_months' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'billing_cycle' => 'nullable|string|in:monthly,yearly',
        ];
    }
}

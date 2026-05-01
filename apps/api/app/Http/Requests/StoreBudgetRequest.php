<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'method' => 'string|in:50_30_20,custom,zero_based',
            'income_baseline' => 'numeric',
            'duration' => 'string|in:monthly,weekly,yearly',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.name' => 'required|string',
            'items.*.percentage' => 'nullable|numeric',
            'items.*.amount_limit' => 'nullable|numeric',
            'items.*.color' => 'nullable|string',
            'items.*.icon' => 'nullable|string',
            'items.*.category_ids' => 'array',
        ];
    }
}

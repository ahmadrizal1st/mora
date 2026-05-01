<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'budget_method' => 'sometimes|string|in:50_30_20,custom,zero_based,envelope',
            'income_baseline' => 'sometimes|numeric|min:0',
            'period' => 'sometimes|string|in:monthly,weekly,yearly',
            'is_active' => 'boolean',
            'rollover_enabled' => 'boolean',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'items' => 'array',
            'items.*.id' => 'sometimes|uuid|exists:budget_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.percentage' => 'nullable|numeric|min:0|max:100',
            'items.*.amount_limit' => 'nullable|numeric|min:0',
            'items.*.color' => 'nullable|string|max:20',
            'items.*.icon' => 'nullable|string|max:50',
            'items.*.category_ids' => 'array',
            'items.*.category_ids.*' => 'uuid|exists:categories,id',
        ];
    }
}

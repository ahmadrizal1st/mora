<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('providers')->where(function ($query) {
                    return $query->where('user_id', $this->user()?->id)
                                 ->orWhere('is_global', true);
                }),
            ],
            'type' => ['required', Rule::in(['bank', 'ewallet', 'investment', 'other'])],
            'logo_url' => ['nullable', 'url', 'max:500'],
            'color' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama provider wajib diisi.',
            'type.required' => 'Tipe provider wajib dipilih.',
            'name.unique' => 'Nama provider sudah ada.',
        ];
    }
}

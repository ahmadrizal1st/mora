<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'avatar_url' => ['sometimes', 'nullable', 'string', 'url', 'max:2048'],
        ];
    }

    
    public function messages(): array
    {
        return [
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'avatar_url.url' => 'Format URL avatar tidak valid.',
            'avatar_url.max' => 'URL avatar tidak boleh lebih dari 2048 karakter.',
        ];
    }
}

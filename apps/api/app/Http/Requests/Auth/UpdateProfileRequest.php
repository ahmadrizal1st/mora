<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
            'avatar.max' => 'URL avatar tidak boleh lebih dari 2048 karakter.',
        ];
    }
}

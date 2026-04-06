<?php

namespace App\Http\Requests\Auth;

use App\Models\OtpCode;
use Illuminate\Foundation\Http\FormRequest;

class ResendOtpRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'type' => ['required', 'string', 'in:' . OtpCode::TYPE_REGISTER . ',' . OtpCode::TYPE_RESET_PASSWORD],
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'type.required' => 'Tipe OTP wajib diisi.',
            'type.in' => 'Tipe OTP harus berupa register atau reset_password.',
        ];
    }
}

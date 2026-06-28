<?php

namespace App\Http\Requests\Auth;

use App\Models\OtpCode;
use Illuminate\Foundation\Http\FormRequest;

class ResendOtpRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'type' => ['required', 'string', 'in:' . OtpCode::TYPE_REGISTER . ',' . OtpCode::TYPE_RESET_PASSWORD],
        ];
    }

    
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

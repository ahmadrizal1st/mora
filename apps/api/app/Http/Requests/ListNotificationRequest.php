<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'filter' => 'nullable|string|in:unread,starred,archive,budgeting,saving,credit,expense,income',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}

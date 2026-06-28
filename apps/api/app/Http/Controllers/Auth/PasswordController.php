<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordController extends Controller
{
    
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        AuthService::forgotPassword($request->validated('email'));

        
        return response()->json([
            'message' => 'OTP reset dikirim.',
        ]);
    }

    
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        AuthService::resetPassword(
            $validated['email'],
            $validated['otp'],
            $validated['new_password']
        );

        return response()->json([
            'message' => 'Password berhasil diubah.',
        ]);
    }

    
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        AuthService::changePassword(
            $request->user(),
            $validated['current_password'],
            $validated['new_password']
        );

        return response()->json([
            'message' => 'Password diubah.',
        ]);
    }
}

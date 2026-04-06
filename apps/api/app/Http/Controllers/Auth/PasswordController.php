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
    /**
     * Send OTP for password reset.
     *
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        AuthService::forgotPassword($request->validated('email'));

        // Always return success to prevent user enumeration
        return response()->json([
            'message' => 'OTP reset dikirim.',
        ]);
    }

    /**
     * Reset password using OTP.
     *
     * POST /api/auth/reset-password
     */
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

    /**
     * Change password for authenticated user.
     *
     * PATCH /api/auth/me/password
     */
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

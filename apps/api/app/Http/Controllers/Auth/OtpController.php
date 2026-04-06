<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResendOtpRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class OtpController extends Controller
{
    /**
     * Resend OTP code.
     *
     * POST /api/auth/resend-otp
     */
    public function resend(ResendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        AuthService::sendOtp(
            $validated['email'],
            $validated['type']
        );

        // Always return success to prevent user enumeration
        return response()->json([
            'message' => 'OTP dikirim ulang.',
        ]);
    }
}

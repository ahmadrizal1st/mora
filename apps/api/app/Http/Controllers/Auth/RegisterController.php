<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    /**
     * Register a new user account.
     *
     * POST /api/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = AuthService::register($request->validated());

        return response()->json([
            'user_id' => $user->id,
            'email' => $user->email,
            'message' => 'OTP dikirim ke email.',
        ], 201);
    }

    /**
     * Verify OTP to complete registration.
     *
     * POST /api/auth/verify-otp
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $result = AuthService::verifyRegistrationOtp(
            $request->validated('email'),
            $request->validated('otp')
        );

        return response()->json([
            'access_token' => $result['access_token'],
            'user' => $result['user'],
        ]);
    }
}

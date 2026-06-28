<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = AuthService::register($request->validated());

        return response()->json([
            'data' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'message' => 'OTP dikirim ke email.',
            ]
        ], 201);
    }

    
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $result = AuthService::verifyRegistrationOtp(
            $request->validated('email'),
            $request->validated('otp')
        );

        return response()->json([
            'data' => [
                'access_token' => $result['access_token'],
                'user' => $result['user'],
            ]
        ]);
    }
}

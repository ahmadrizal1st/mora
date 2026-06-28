<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResendOtpRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class OtpController extends Controller
{
    
    public function resend(ResendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        AuthService::sendOtp(
            $validated['email'],
            $validated['type']
        );

        
        return response()->json([
            'message' => 'OTP dikirim ulang.',
        ]);
    }
}

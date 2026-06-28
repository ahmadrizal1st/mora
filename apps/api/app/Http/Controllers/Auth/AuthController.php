<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    
    public function login(LoginRequest $request): JsonResponse
    {
        $result = AuthService::login($request->validated());

        return response()->json([
            'data' => [
                'access_token' => $result['access_token'],
                'user' => $result['user'],
            ]
        ]);
    }

    
    public function logout(Request $request): JsonResponse
    {
        AuthService::logout($request->user());

        return response()->json([
            'message' => 'Logged out.',
        ]);
    }

    
    public function refresh(Request $request): JsonResponse
    {
        $token = AuthService::refreshToken($request->user());

        return response()->json([
            'access_token' => $token,
        ]);
    }
}
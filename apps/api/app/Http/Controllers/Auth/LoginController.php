<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginController extends Controller
{

    /**
     * Authenticate user and issue access token.
     *
     * POST /api/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = AuthService::login($request->validated());

        return response()->json([
            'access_token' => $result['access_token'],
            'user' => $result['user'],
        ]);
    }

    /**
     * Logout user and revoke all tokens.
     *
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        AuthService::logout($request->user());

        return response()->json([
            'message' => 'Logged out.',
        ]);
    }

    /**
     * Refresh access token.
     *
     * POST /api/auth/refresh
     */
    public function refresh(Request $request): JsonResponse
    {
        $token = AuthService::refreshToken($request->user());

        return response()->json([
            'access_token' => $token,
        ]);
    }
}
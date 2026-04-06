<?php

namespace App\Http\Controllers\Auth;
 
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
 
class GoogleAuthController extends Controller
{
    /**
     * Authenticate user with Google ID Token.
     *
     * POST /api/auth/google
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|string',
        ]);
 
        $result = AuthService::loginWithGoogle($request->credential);
 
        return response()->json([
            'access_token' => $result['access_token'],
            'user' => $result['user'],
        ]);
    }
}

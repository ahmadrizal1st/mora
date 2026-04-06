<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::prefix('auth')->group(function () {

    // ----- Public routes (tanpa autentikasi) -----

    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/verify-otp', [RegisterController::class, 'verifyOtp']);

    Route::post('/login', [LoginController::class, 'login'])
        ->middleware('throttle:login');

    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword'])
        ->middleware('throttle:forgot-password');

    Route::post('/reset-password', [PasswordController::class, 'resetPassword']);

    Route::post('/resend-otp', [OtpController::class, 'resend'])
        ->middleware('throttle:resend-otp');

    // ----- Protected routes (membutuhkan Sanctum token) -----

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [LoginController::class, 'logout']);
        Route::post('/refresh', [LoginController::class, 'refresh']);

        Route::get('/me', [ProfileController::class, 'show']);
        Route::patch('/me', [ProfileController::class, 'update']);
        Route::patch('/me/password', [PasswordController::class, 'changePassword']);
    });
});

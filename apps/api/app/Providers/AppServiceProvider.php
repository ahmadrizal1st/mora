<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Configure custom rate limiters for authentication endpoints.
     */
    protected function configureRateLimiting(): void
    {
        // Login: 10 attempts per minute per IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak percobaan login. Silakan coba lagi nanti.',
                    ], 429);
                });
        });

        // Forgot password: 5 attempts per minute per IP
        RateLimiter::for('forgot-password', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan reset password. Silakan coba lagi nanti.',
                    ], 429);
                });
        });

        // Resend OTP: 3 attempts per minute per IP
        RateLimiter::for('resend-otp', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan OTP. Silakan coba lagi nanti.',
                    ], 429);
                });
        });
    }
}


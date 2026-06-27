<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Http\Middleware\ApiKeyMiddleware::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request) => 
            $request->is('api/*') || $request->expectsJson() 
                ? abort(response()->json(['message' => 'Unauthenticated. Silakan login terlebih dahulu.'], 401)) 
                : route('login')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            \Log::info("AuthException Path: " . $request->path() . " ExpectsJSON: " . ($request->expectsJson() ? "yes" : "no"));
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                ], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Database\QueryException $e, Request $request) {
            \Log::info("AuthException Path: " . $request->path() . " ExpectsJSON: " . ($request->expectsJson() ? "yes" : "no"));
            if ($request->is('api/*') || $request->expectsJson()) {
                $message = $e->getMessage();
                
                // Check if it's a connection error (SQLSTATE 08006, Connection refused, or similar)
                if (str_contains($message, '08006') || 
                    str_contains($message, 'Connection refused') || 
                    str_contains($message, 'SQLSTATE[08006]') ||
                    str_contains($message, 'Is the server running')) {
                    return response()->json([
                        'error_code' => 'DATABASE_CONNECTION_ERROR',
                        'message' => 'Cannot connect to database. Please try again later.',
                    ], 503);
                }
            }
        });

        $exceptions->render(function (\PDOException $e, Request $request) {
            \Log::info("AuthException Path: " . $request->path() . " ExpectsJSON: " . ($request->expectsJson() ? "yes" : "no"));
            if ($request->is('api/*') || $request->expectsJson()) {
                $message = $e->getMessage();
                if (str_contains($message, '08006') || 
                    str_contains($message, 'Connection refused') ||
                    str_contains($message, 'Is the server running')) {
                    return response()->json([
                        'error_code' => 'DATABASE_CONNECTION_ERROR',
                        'message' => 'Cannot connect to database. Please try again later.',
                    ], 503);
                }
            }
        });
    })->create();


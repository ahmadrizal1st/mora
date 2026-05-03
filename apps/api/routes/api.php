<?php

use App\Http\Controllers\{
    Auth\GoogleAuthController,
    Auth\LoginController,
    Auth\OtpController,
    Auth\PasswordController,
    Auth\ProfileController,
    Auth\RegisterController,
    AccountController,
    CategoryController,
    CreditController,
    LookupController,
    TagController,
    TransactionController,
    BudgetController,
    DocumentExtractionController,
    NotificationController,
    ProviderController,
};
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

    Route::post('/google', [GoogleAuthController::class, 'googleLogin']);

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

/*
|--------------------------------------------------------------------------
| Transaction Module Routes (Protected)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    Route::get('transactions-summary', [TransactionController::class, 'summary']);
    Route::get('transactions-history', [TransactionController::class, 'history']);

    // Accounts
    Route::apiResource('accounts', AccountController::class);

    // Credits
    Route::get('credits', [CreditController::class, 'index']);
    Route::post('accounts/{account}/credit', [CreditController::class, 'store']);
    Route::delete('accounts/{account}/credit', [CreditController::class, 'destroy']);

    // Categories
    Route::get('categories', [CategoryController::class, 'index']);

    // Tags
    Route::apiResource('tags', TagController::class)->except(['show']);

    // Lookups
    Route::get('currencies', [LookupController::class, 'currencies']);
    Route::get('statuses', [LookupController::class, 'statuses']);
    Route::get('recurring-types', [LookupController::class, 'recurringTypes']);
    Route::get('providers', [ProviderController::class, 'index']);
    Route::post('providers', [ProviderController::class, 'store']);

    // Budgeting
    Route::apiResource('budgets', BudgetController::class);
    Route::get('budgets-utilization', [BudgetController::class, 'utilization']);
    Route::post('budgets/{id}/duplicate', [BudgetController::class, 'duplicate']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/{id}/star', [NotificationController::class, 'toggleStar']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

    // OCR & Documents
    Route::post('documents/upload', [DocumentExtractionController::class, 'upload']);
    Route::post('documents/text', [DocumentExtractionController::class, 'processText']);
});

<?php

use App\Http\Controllers\{
    Auth\GoogleAuthController,
    Auth\AuthController,
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

    NotificationController,
    ProviderController,
    DebtController,
    GoalController,
    SubscriptionController,
    ChatController,
    DocumentController,
    PromptTemplateController,
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

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login');

    Route::post('/google', [GoogleAuthController::class, 'googleLogin']);

    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword'])
        ->middleware('throttle:forgot-password');

    Route::post('/reset-password', [PasswordController::class, 'resetPassword']);

    Route::post('/resend-otp', [OtpController::class, 'resend'])
        ->middleware('throttle:resend-otp');

    // ----- Protected routes (membutuhkan Sanctum token) -----

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);

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
    Route::get('transactions-statistics', [TransactionController::class, 'statistics']);

    // Accounts
    Route::apiResource('accounts', AccountController::class);
    Route::get('accounts-summary', [AccountController::class, 'summary']);
    Route::get('accounts-analytics', [AccountController::class, 'analytics']);

    // Assets
    Route::apiResource('assets', \App\Http\Controllers\AssetController::class);

    // Debts
    Route::apiResource('debts', DebtController::class);

    // Planning
    Route::apiResource('goals', GoalController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);

    // Credits
    Route::get('credits', [CreditController::class, 'index']);
    Route::post('accounts/{account}/credit', [CreditController::class, 'store']);
    Route::get('accounts/{account}/credit', [CreditController::class, 'show']);
    Route::put('accounts/{account}/credit', [CreditController::class, 'update']);
    Route::delete('accounts/{account}/credit', [CreditController::class, 'destroy']);

    // Gamification
    Route::prefix('gamification')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\GamificationController::class, 'stats']);
        Route::get('/achievements', [\App\Http\Controllers\GamificationController::class, 'achievements']);
        Route::get('/leaderboard', [\App\Http\Controllers\GamificationController::class, 'leaderboard']);
        Route::post('/achievements/{id}/claim', [\App\Http\Controllers\GamificationController::class, 'claim']);
    });


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
    Route::get('budgets-utilization', [BudgetController::class, 'utilization']);
    Route::get('budgets/insights', [BudgetController::class, 'insights']);
    Route::get('budgets/history', [BudgetController::class, 'history']);
    Route::post('budgets/{id}/duplicate', [BudgetController::class, 'duplicate']);
    Route::apiResource('budgets', BudgetController::class);
    Route::post('budgets/{id}/duplicate', [BudgetController::class, 'duplicate']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/{id}/star', [NotificationController::class, 'toggleStar']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

    // OCR & Documents
    Route::post('documents/upload', [DocumentController::class, 'upload']);
    Route::post('documents/text', [DocumentController::class, 'processText']);

    // Chat
    Route::get('chat/sessions', [ChatController::class, 'sessions']);
    Route::post('chat/sessions', [ChatController::class, 'createSession']);
    Route::delete('chat/sessions', [ChatController::class, 'deleteSessions']);
    Route::get('chat/sessions/{sessionId}/messages', [ChatController::class, 'messages']);
    Route::post('chat/send', [ChatController::class, 'send']);

    // Prompt Templates
    Route::get('prompt-templates', [PromptTemplateController::class, 'index']);
    Route::post('prompt-templates', [PromptTemplateController::class, 'store']);
    Route::put('prompt-templates/{id}', [PromptTemplateController::class, 'update']);
    Route::delete('prompt-templates/{id}', [PromptTemplateController::class, 'destroy']);
    Route::post('prompt-templates/{id}/use', [PromptTemplateController::class, 'use']);
});

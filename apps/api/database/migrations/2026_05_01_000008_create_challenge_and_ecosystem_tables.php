<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('type'); // saving/spending/investment
            $table->decimal('target_amount', 15, 2)->nullable();
            $table->foreignUuid('currency_id')->nullable()->constrained('currencies')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->bigInteger('xp_reward');
            $table->bigInteger('coin_reward');
            $table->timestamps();
        });

        Schema::create('challenge_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('challenge_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('progress_amount', 15, 2)->default(0);
            $table->boolean('is_winner')->default(false);
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('reward_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('type'); // cashback/voucher/frame/theme/shield/fee_waiver
            $table->bigInteger('coin_price');
            $table->string('image_url')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('reward_item_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('coins_spent');
            $table->string('status')->default('pending'); // pending/completed/failed
            $table->timestamp('redeemed_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('referrer_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('referred_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('referral_code');
            $table->bigInteger('xp_reward');
            $table->bigInteger('coin_reward');
            $table->timestamps();
        });

        Schema::create('vault_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('file_type'); // pdf/image/doc
            $table->string('encrypted_url');
            $table->timestamps();
        });

        Schema::create('news_preferences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->json('topics')->nullable();
            $table->json('asset_tickers')->nullable();
            $table->timestamps();
        });

        Schema::create('learning_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('content_id');
            $table->string('content_type'); // article/video/quiz/path
            $table->integer('progress_pct')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_progress');
        Schema::dropIfExists('news_preferences');
        Schema::dropIfExists('vault_documents');
        Schema::dropIfExists('referrals');
        Schema::dropIfExists('reward_redemptions');
        Schema::dropIfExists('reward_items');
        Schema::dropIfExists('challenge_participants');
        Schema::dropIfExists('challenges');
    }
};

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
        Schema::create('leaderboard_snapshots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('period_type'); // weekly/monthly
            $table->date('period_date');
            $table->string('scope'); // friends/city/national
            $table->integer('rank');
            $table->bigInteger('score');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('weekly_recaps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->date('week_start_date');
            $table->bigInteger('total_income_raw');
            $table->bigInteger('total_expense_raw');
            $table->json('top_categories')->nullable();
            $table->string('financial_health_score')->nullable();
            $table->text('ai_insight')->nullable();
            $table->timestamps();
        });

        Schema::create('shareable_cards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('card_type'); // streak/wrapped/badge/goal/level_up/health_score
            $table->string('image_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shareable_cards');
        Schema::dropIfExists('weekly_recaps');
        Schema::dropIfExists('leaderboard_snapshots');
    }
};

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
        Schema::create('gamification_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('xp')->default(0);
            $table->bigInteger('coins')->default(0);
            $table->bigInteger('gemfin')->default(0);
            $table->integer('level')->default(1);
            $table->timestamps();
        });

        Schema::create('streaks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // login/transaction/budget/investment/saving
            $table->integer('current_count')->default(0);
            $table->integer('longest_count')->default(0);
            $table->date('last_activity_date')->nullable();
            $table->timestamps();
        });

        Schema::create('quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('type'); // daily/weekly
            $table->string('action_type');
            $table->integer('target_count');
            $table->integer('xp_reward');
            $table->integer('coin_reward');
            $table->timestamps();
        });

        Schema::create('user_quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('quest_id')->constrained()->cascadeOnDelete();
            $table->integer('progress_count')->default(0);
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('badges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('icon_url')->nullable();
            $table->string('criteria_type');
            $table->integer('criteria_value');
            $table->timestamps();
        });

        Schema::create('user_badges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('badge_id')->constrained()->cascadeOnDelete();
            $table->timestamp('earned_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('user_quests');
        Schema::dropIfExists('quests');
        Schema::dropIfExists('streaks');
        Schema::dropIfExists('gamification_profiles');
    }
};

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
        Schema::create('account_balances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('account_id')->constrained()->cascadeOnDelete();
            $table->date('period_month');
            $table->bigInteger('balance_raw')->default(0);
            $table->float('balance_in_default')->default(0);
            $table->timestamp('updated_at')->nullable();
        });

        Schema::create('budget_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('budget_method')->default('custom');
            $table->decimal('income_baseline', 15, 2)->default(0);
            $table->string('period')->default('monthly');
            $table->boolean('is_active')->default(true);
            $table->boolean('rollover_enabled')->default(false);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        Schema::create('budget_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_plan_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('percentage', 5, 2)->default(0);
            $table->decimal('amount_limit', 15, 2)->default(0);
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('budget_item_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_item_categories');
        Schema::dropIfExists('budget_items');
        Schema::dropIfExists('budget_plans');
        Schema::dropIfExists('account_balances');
    }
};

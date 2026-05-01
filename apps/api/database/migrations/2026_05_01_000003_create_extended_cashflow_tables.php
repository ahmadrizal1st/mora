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
        Schema::create('split_bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->decimal('total_amount', 15, 2);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->string('status')->default('open'); // open/settled
            $table->timestamps();
        });

        Schema::create('split_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('split_bill_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('participant_name')->nullable();
            $table->decimal('share_amount', 15, 2);
            $table->boolean('is_settled')->default(false);
            $table->timestamp('settled_at')->nullable();
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('last_transaction_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->string('name');
            $table->decimal('amount', 15, 2);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->date('next_billing_date')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->string('billing_cycle')->default('monthly'); // monthly/yearly/weekly
            $table->timestamps();
        });

        Schema::create('reminders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('entity_type'); // credit/subscription/goal/zakat
            $table->uuid('entity_id')->nullable();
            $table->date('due_date');
            $table->json('notify_schedule')->nullable();
            $table->boolean('is_sent')->default(false);
            $table->timestamps();
        });

        Schema::create('automation_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('trigger_type');
            $table->json('condition')->nullable();
            $table->json('action')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_triggered_at')->nullable();
            $table->timestamps();
        });

        Schema::create('round_up_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_id')->constrained()->cascadeOnDelete();
            $table->uuid('goal_id')->nullable(); // FK to goals (Step 3)
            $table->string('round_to')->default('1000');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('salary_split_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('source_account_id')->constrained('accounts')->cascadeOnDelete();
            $table->json('allocations')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_split_configs');
        Schema::dropIfExists('round_up_configs');
        Schema::dropIfExists('automation_rules');
        Schema::dropIfExists('reminders');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('split_participants');
        Schema::dropIfExists('split_bills');
    }
};

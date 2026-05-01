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
        Schema::create('credit_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type'); // mortgage/personal/paylater/credit_card
            $table->string('provider_name');
            $table->decimal('principal_amount', 15, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->integer('tenor_months');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('billing_cycle')->default('monthly');
            $table->timestamps();
        });

        Schema::create('credit_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('credit_id')->constrained('credit_accounts')->cascadeOnDelete();
            $table->date('due_date');
            $table->decimal('amount_due', 15, 2);
            $table->decimal('principal_portion', 15, 2)->nullable();
            $table->decimal('interest_portion', 15, 2)->nullable();
            $table->boolean('is_paid')->default(false);
            $table->date('paid_date')->nullable();
            $table->foreignUuid('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('goals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('linked_account_id')->nullable();
            $table->string('name');
            $table->string('type'); // emergency/hajj/retirement/custom
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->date('deadline_date')->nullable();
            $table->timestamps();
        });

        Schema::create('insurance_policies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('policy_number')->nullable();
            $table->string('provider_name');
            $table->string('type'); // life/health/vehicle/property
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->string('premium_period')->default('monthly');
            $table->date('expiry_date')->nullable();
            $table->decimal('coverage_amount', 15, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('zakat_calculations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('zakat_type'); // mal/income/gold
            $table->decimal('asset_value', 15, 2);
            $table->decimal('nisab_value', 15, 2);
            $table->decimal('zakat_due', 15, 2);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->date('calculation_date');
            $table->boolean('is_paid')->default(false);
            $table->foreignUuid('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zakat_calculations');
        Schema::dropIfExists('insurance_policies');
        Schema::dropIfExists('goals');
        Schema::dropIfExists('credit_schedules');
        Schema::dropIfExists('credit_accounts');
    }
};

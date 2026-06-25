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

        Schema::create('debts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('person_name');
            $table->text('description')->nullable();
            $table->string('type'); // 'Utang' or 'Piutang'
            $table->decimal('amount', 15, 2);
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->string('status')->default('Menunggu'); // 'Jatuh Tempo', 'Menunggu', 'Sebagian', 'Lunas'
            $table->string('priority')->default('Sedang'); // 'Tinggi', 'Sedang', 'Rendah'
            $table->date('due_date');
            $table->timestamps();
        });

        Schema::create('goals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->date('deadline_date')->nullable();
            $table->decimal('monthly_deposit', 15, 2)->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
        Schema::dropIfExists('debts');
        Schema::dropIfExists('credit_schedules');
        Schema::dropIfExists('credit_accounts');
    }
};

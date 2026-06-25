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
            $table->string('status')->default('upcoming');
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('split_participants');
        Schema::dropIfExists('split_bills');
    }
};

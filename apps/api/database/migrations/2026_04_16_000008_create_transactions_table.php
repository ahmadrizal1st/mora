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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // income/expense/transfer
            $table->bigInteger('amount_raw');
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->float('exchange_rate')->default(1.0);
            $table->float('amount_in_default')->default(0);
            $table->foreignUuid('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->uuid('to_account_id')->nullable();
            $table->uuid('category_id')->nullable();
            $table->uuid('status_id')->nullable();
            $table->uuid('recurring_type_id')->nullable();
            $table->uuid('budget_item_id')->nullable();
            $table->uuid('document_extraction_id')->nullable();
            $table->uuid('split_bill_id')->nullable();
            $table->date('tx_date');
            $table->string('input_method')->default('manual'); // manual/voice/receipt/autopilot
            $table->string('merchant')->nullable();
            $table->text('notes')->nullable();
            $table->json('dynamic_fields')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'tx_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

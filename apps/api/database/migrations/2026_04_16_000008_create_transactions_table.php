<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['income', 'expense', 'transfer']);
            $table->bigInteger('amount_raw');
            $table->foreignId('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->float('rate_snapshot')->default(1);
            $table->float('amount_in_default')->default(0);
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('to_account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('status_id')->nullable()->constrained('statuses')->nullOnDelete();
            $table->foreignId('recurring_type_id')->nullable()->constrained('recurring_types')->nullOnDelete();
            $table->date('tx_date');
            $table->string('merchant')->nullable();
            $table->text('notes')->nullable();
            $table->json('dynamic_fields')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes for common queries
            $table->index(['user_id', 'tx_date']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'account_id']);
            $table->index(['user_id', 'category_id']);
        });

        Schema::create('transaction_tags', function (Blueprint $table) {
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['transaction_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_tags');
        Schema::dropIfExists('transactions');
    }
};

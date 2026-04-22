<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn(['balance_raw', 'is_credit', 'credit_limit']);
        });

        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('limit')->default(0);
            $table->bigInteger('total_amount')->default(0);
            $table->bigInteger('installment_amount')->default(0);
            $table->enum('installment_type', ['monthly', 'yearly'])->default('monthly');
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credits');

        Schema::table('accounts', function (Blueprint $table) {
            $table->bigInteger('balance_raw')->default(0);
            $table->boolean('is_credit')->default(false);
            $table->bigInteger('credit_limit')->default(0);
        });
    }
};

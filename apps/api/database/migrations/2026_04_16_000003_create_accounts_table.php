<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->bigInteger('balance_raw')->default(0);
            $table->foreignId('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->string('color', 20)->default('#206bc4');
            $table->enum('type', ['cash', 'bank', 'e-wallet', 'investment'])->default('cash');
            $table->boolean('is_credit')->default(false);
            $table->bigInteger('credit_limit')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};

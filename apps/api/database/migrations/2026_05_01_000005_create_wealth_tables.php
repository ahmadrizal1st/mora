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
        Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticker')->unique();
            $table->string('name');
            $table->string('type'); // stock/crypto/mutual_fund/gold/bond
            $table->string('provider')->nullable();
            $table->timestamps();
        });

        Schema::create('asset_price_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->date('price_date');
            $table->decimal('close_price', 15, 2);
            $table->decimal('open_price', 15, 2)->nullable();
            $table->decimal('high_price', 15, 2)->nullable();
            $table->decimal('low_price', 15, 2)->nullable();
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('portfolios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_id')->nullable()->constrained()->nullOnDelete();
            $table->float('quantity');
            $table->decimal('average_buy_price', 15, 2);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('watchlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->decimal('alert_price_low', 15, 2)->nullable();
            $table->decimal('alert_price_high', 15, 2)->nullable();
            $table->boolean('alert_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('dividend_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->date('ex_date');
            $table->date('pay_date')->nullable();
            $table->decimal('amount_per_share', 15, 2);
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dividend_events');
        Schema::dropIfExists('watchlists');
        Schema::dropIfExists('portfolios');
        Schema::dropIfExists('asset_price_history');
        Schema::dropIfExists('assets');
    }
};

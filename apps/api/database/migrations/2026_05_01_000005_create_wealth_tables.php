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
            $table->bigInteger('close_price_raw');
            $table->bigInteger('open_price_raw')->nullable();
            $table->bigInteger('high_price_raw')->nullable();
            $table->bigInteger('low_price_raw')->nullable();
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('portfolios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('account_id')->nullable()->constrained()->nullOnDelete();
            $table->float('quantity');
            $table->bigInteger('average_buy_price_raw');
            $table->foreignUuid('currency_id')->constrained('currencies')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('watchlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('alert_price_low_raw')->nullable();
            $table->bigInteger('alert_price_high_raw')->nullable();
            $table->boolean('alert_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('dividend_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('asset_id')->constrained()->cascadeOnDelete();
            $table->date('ex_date');
            $table->date('pay_date')->nullable();
            $table->bigInteger('amount_per_share_raw');
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

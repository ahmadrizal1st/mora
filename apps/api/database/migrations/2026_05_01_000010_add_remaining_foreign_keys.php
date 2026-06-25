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
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('to_account_id')->references('id')->on('accounts')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
            $table->foreign('status_id')->references('id')->on('statuses')->nullOnDelete();
            $table->foreign('recurring_type_id')->references('id')->on('recurring_types')->nullOnDelete();
            $table->foreign('budget_item_id')->references('id')->on('budget_items')->nullOnDelete();
            $table->foreign('document_extraction_id')->references('id')->on('document_extractions')->nullOnDelete();
            $table->foreign('split_bill_id')->references('id')->on('split_bills')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['to_account_id']);
            $table->dropForeign(['category_id']);
            $table->dropForeign(['status_id']);
            $table->dropForeign(['recurring_type_id']);
            $table->dropForeign(['budget_item_id']);
            $table->dropForeign(['document_extraction_id']);
            $table->dropForeign(['split_bill_id']);
        });
    }
};

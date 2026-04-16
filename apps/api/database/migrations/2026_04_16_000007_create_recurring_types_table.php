<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recurring_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('interval_days');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recurring_types');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('llm_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('is_default')->default(false);
            $table->string('name');
            $table->string('base_url');
            $table->text('api_key')->nullable();
            $table->string('auth_type')->default('bearer'); // bearer, query_param, header
            $table->text('headers')->nullable();
            $table->json('payload_template');
            $table->string('response_path');
            $table->string('default_model')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(100);
            $table->timestamp('last_rotated_at')->nullable();
            $table->timestamps();

            $table->unique(['name', 'user_id']);
        });

        // Add the database-level check constraint using raw SQL
        if (config('database.default') !== 'sqlite') {
            DB::statement('ALTER TABLE llm_providers ADD CONSTRAINT check_is_default_user_id CHECK (NOT (is_default = true AND user_id IS NOT NULL))');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('llm_providers');
    }
};

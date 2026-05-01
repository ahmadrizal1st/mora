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
        Schema::create('document_extractions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('document_type'); // receipt/policy/salary_slip/npwp/certificate
            $table->string('file_path')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('original_filename')->nullable();
            $table->text('raw_text')->nullable();
            $table->json('parsed_data')->nullable();
            $table->string('status')->default('pending'); // pending/processed/failed
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('llm_providers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_default')->default(false);
            $table->string('name');
            $table->string('base_url')->nullable();
            $table->text('api_key')->nullable();
            $table->string('auth_type')->nullable();
            $table->text('headers')->nullable();
            $table->json('payload_template')->nullable();
            $table->string('response_path')->nullable();
            $table->string('default_model')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamp('last_rotated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->uuidMorphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_starred')->default(false);
            $table->string('label')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('llm_providers');
        Schema::dropIfExists('document_extractions');
    }
};

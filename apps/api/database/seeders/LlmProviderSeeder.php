<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LlmProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('llm_providers')->updateOrInsert(
            ['name' => 'gemini'],
            [
                'id' => Str::uuid()->toString(),
                'is_default' => true,
                'is_active' => true,
                'priority' => 1,
                'base_url' => null,
                'api_key' => env('GEMINI_API_KEY'),
                'default_model' => 'gemini-1.5-flash',
            ]
        );

        DB::table('llm_providers')->updateOrInsert(
            ['name' => 'groq'],
            [
                'id' => Str::uuid()->toString(),
                'is_default' => true,
                'is_active' => true,
                'priority' => 2,
                'base_url' => null,
                'api_key' => env('GROQ_API_KEY'),
                'default_model' => 'llama-3.1-8b-instant',
            ]
        );
    }
}

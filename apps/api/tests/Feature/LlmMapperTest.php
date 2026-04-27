<?php

namespace Tests\Feature;

use App\Models\LlmProvider;
use App\Models\User;
use App\Services\LLMMapper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LlmMapperTest extends TestCase
{
    use RefreshDatabase;

    protected LLMMapper $mapper;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mapper = new LLMMapper();
    }

    public function test_mapper_prioritizes_user_provider(): void
    {
        $user = User::factory()->create();

        // System Default Provider (Priority 1)
        LlmProvider::create([
            'name' => 'system_gemini',
            'is_default' => true,
            'is_active' => true,
            'priority' => 1,
            'base_url' => 'https://system.api',
            'api_key' => 'system_key',
            'auth_type' => 'bearer',
            'payload_template' => ['text' => '{prompt}'],
            'response_path' => 'result',
        ]);

        // User Custom Provider (Priority 10)
        LlmProvider::create([
            'user_id' => $user->id,
            'name' => 'user_groq',
            'is_default' => false,
            'is_active' => true,
            'priority' => 10,
            'base_url' => 'https://user.api',
            'api_key' => 'user_key',
            'auth_type' => 'bearer',
            'payload_template' => ['text' => '{prompt}'],
            'response_path' => 'result',
        ]);

        Http::fake([
            'https://user.api' => Http::response(['result' => '{"success":true}'], 200),
            'https://system.api' => Http::response(['result' => '{"success":false}'], 200),
        ]);

        $result = $this->mapper->map('test prompt', $user->id);

        // Should call user.api first because it belongs to the user, even if priority is higher (numeric)
        Http::assertSent(function ($request) {
            return $request->url() === 'https://user.api' && $request->header('Authorization')[0] === 'Bearer user_key';
        });

        $this->assertEquals(['success' => true], $result);
    }

    public function test_mapper_handles_payload_templates_recursively(): void
    {
        LlmProvider::create([
            'name' => 'template_test',
            'is_default' => true,
            'is_active' => true,
            'priority' => 1,
            'base_url' => 'https://template.api',
            'api_key' => 'key',
            'auth_type' => 'bearer',
            'payload_template' => [
                'nested' => [
                    'content' => 'Prompt: {prompt}',
                    'model_info' => 'Model: {model}'
                ]
            ],
            'response_path' => 'data.text',
            'default_model' => 'test-model'
        ]);

        Http::fake([
            'https://template.api' => Http::response(['data' => ['text' => '{"found":true}']], 200),
        ]);

        $this->mapper->map('hello', null);

        Http::assertSent(function ($request) {
            $data = $request->data();
            return $data['nested']['content'] === 'Prompt: hello' 
                && $data['nested']['model_info'] === 'Model: test-model';
        });
    }

    public function test_mapper_fallbacks_on_failure(): void
    {
        LlmProvider::create([
            'name' => 'first',
            'is_default' => true,
            'is_active' => true,
            'priority' => 1,
            'base_url' => 'https://first.api',
            'payload_template' => ['p' => '{prompt}'],
            'response_path' => 'r',
        ]);

        LlmProvider::create([
            'name' => 'second',
            'is_default' => true,
            'is_active' => true,
            'priority' => 2,
            'base_url' => 'https://second.api',
            'payload_template' => ['p' => '{prompt}'],
            'response_path' => 'r',
        ]);

        Http::fake([
            'https://first.api' => Http::response([], 500),
            'https://second.api' => Http::response(['r' => '{"ok":true}'], 200),
        ]);

        $result = $this->mapper->map('test');

        $this->assertEquals(['ok' => true], $result);
        Http::assertSentCount(2);
    }
}

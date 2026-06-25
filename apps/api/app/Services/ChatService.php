<?php

namespace App\Services;

use App\Repositories\ChatSessionRepository;
use App\Repositories\ChatMessageRepository;
use Illuminate\Support\Collection;
use Prism\Prism\Facades\Prism;
use Prism\Prism\Enums\Provider;

class ChatService
{
    private ChatSessionRepository $sessionRepo;
    private ChatMessageRepository $messageRepo;

    public function __construct(ChatSessionRepository $sessionRepo, ChatMessageRepository $messageRepo)
    {
        $this->sessionRepo = $sessionRepo;
        $this->messageRepo = $messageRepo;
    }

    /**
     * Get all sessions for a user.
     */
    public function getSessions(string $userId): Collection
    {
        return $this->sessionRepo->getByUser($userId);
    }

    /**
     * Create a new session.
     */
    public function createSession(string $userId, string $title = 'New Conversation')
    {
        return $this->sessionRepo->create($userId, $title);
    }

    /**
     * Delete sessions.
     */
    public function deleteSessions(string $userId, array $sessionIds): int
    {
        return $this->sessionRepo->deleteMany($sessionIds, $userId);
    }

    /**
     * Get messages for a session.
     */
    public function getMessages(string $userId, string $sessionId): Collection
    {
        $session = $this->sessionRepo->findForUser($sessionId, $userId);
        if (!$session) {
            abort(404, 'Session not found');
        }

        return $this->messageRepo->getBySession($sessionId);
    }

    /**
     * Send a message and get AI response.
     */
    public function sendMessage(string $userId, string $sessionId, string $content, ?string $parentId = null)
    {
        // Verify ownership
        $session = $this->sessionRepo->findForUser($sessionId, $userId);
        if (!$session) {
            abort(404, 'Session not found');
        }

        // Update session title if it's the first message
        if ($session->title === 'New Conversation') {
            $newTitle = substr($content, 0, 30) . (strlen($content) > 30 ? '...' : '');
            $this->sessionRepo->updateTitle($sessionId, $newTitle);
        } else {
            $this->sessionRepo->touch($sessionId);
        }

        // Save User Message
        $userMessage = $this->messageRepo->create($sessionId, 'user', $content, null, $parentId);

        // Fetch recent conversation history for context (e.g., last 10 messages from this branch)
        $history = $this->messageRepo->getThreadContext($sessionId, $userMessage->id, 10);
        
        $messages = [];
        $messages[] = new \Prism\Prism\ValueObjects\Messages\SystemMessage(
            'You are Mora AI, a helpful, intelligent, and concise financial assistant for the VisataMora platform. You help users manage their budget, debt, investments, and gamification streaks. Always use valid Markdown formatting. Keep answers brief and professional.'
        );

        foreach ($history as $msg) {
            if ($msg->role === 'user') {
                $messages[] = new \Prism\Prism\ValueObjects\Messages\UserMessage($msg->content);
            } else {
                $messages[] = new \Prism\Prism\ValueObjects\Messages\AssistantMessage($msg->content);
            }
        }

        // 1. Cek User Level (Apakah user ini punya API Key sendiri yang aktif?)
        $aiConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->orderBy('priority', 'desc')
            ->first();

        // 2. Cek System Level (Apakah ada API Key global dari Admin?)
        if (!$aiConfig) {
            $aiConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
                ->whereNull('user_id')
                ->where('is_default', true)
                ->where('is_active', true)
                ->orderBy('priority', 'desc')
                ->first();
        }

        // 3. Fallback ke konfigurasi file (.env) jika DB kosong
        $providerName = $aiConfig ? $aiConfig->name : config('ai.default', 'groq');
        $modelName = $aiConfig ? $aiConfig->default_model : config('ai.models.chat', 'llama-3.1-8b-instant');

        // 4. Timpa konfigurasi Prism (di memori) jika menggunakan data dari Database
        if ($aiConfig) {
            config(["prism.providers.{$providerName}.api_key" => $aiConfig->api_key]);
            if (!empty($aiConfig->base_url)) {
                config(["prism.providers.{$providerName}.url" => $aiConfig->base_url]);
            }
        }

        $providerEnum = match(strtolower($providerName)) {
            'openai' => Provider::OpenAI,
            'anthropic' => Provider::Anthropic,
            'gemini' => Provider::Gemini,
            'groq' => Provider::Groq,
            'ollama' => Provider::Ollama,
            'mistral' => Provider::Mistral,
            default => Provider::Groq,
        };

        // Generate AI Response using Prism dynamically
        $response = Prism::text()
            ->using($providerEnum, $modelName)
            ->withMessages($messages)
            ->generate();

        $aiContent = $response->text;

        // Save AI Message
        $aiMessage = $this->messageRepo->create($sessionId, 'ai', $aiContent, [
            'model' => $modelName,
            'provider' => $providerName,
            'usage' => [
                'prompt_tokens' => $response->usage->promptTokens,
                'completion_tokens' => $response->usage->completionTokens,
            ]
        ], $userMessage->id);

        return [
            'user_message' => [
                'id' => $userMessage->id,
                'role' => $userMessage->role,
                'content' => $userMessage->content,
                'parent_id' => $userMessage->parent_id,
                'timestamp' => $userMessage->created_at->toIso8601String(),
            ],
            'ai_message' => [
                'id' => $aiMessage->id,
                'role' => $aiMessage->role,
                'content' => $aiMessage->content,
                'parent_id' => $aiMessage->parent_id,
                'timestamp' => $aiMessage->created_at->toIso8601String(),
            ]
        ];
    }
}

<?php

namespace App\Repositories;

use App\Models\ChatSession;
use Illuminate\Support\Collection;

class ChatSessionRepository
{
    
    public function getByUser(string $userId): Collection
    {
        return ChatSession::where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'updated_at']);
    }

    
    public function create(string $userId, string $title = 'New Conversation'): ChatSession
    {
        return ChatSession::create([
            'user_id' => $userId,
            'title' => $title,
        ]);
    }

    
    public function findForUser(string $sessionId, string $userId): ?ChatSession
    {
        return ChatSession::where('id', $sessionId)
            ->where('user_id', $userId)
            ->first();
    }

    
    public function updateTitle(string $sessionId, string $title): void
    {
        ChatSession::where('id', $sessionId)->update(['title' => $title]);
    }

    
    public function deleteMany(array $sessionIds, string $userId): int
    {
        return ChatSession::where('user_id', $userId)
            ->whereIn('id', $sessionIds)
            ->delete();
    }

    
    public function touch(string $sessionId): void
    {
        ChatSession::where('id', $sessionId)->touch();
    }
}

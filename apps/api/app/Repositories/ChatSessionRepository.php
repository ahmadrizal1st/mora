<?php

namespace App\Repositories;

use App\Models\ChatSession;
use Illuminate\Support\Collection;

class ChatSessionRepository
{
    /**
     * Get all sessions for a user, ordered by latest.
     */
    public function getByUser(string $userId): Collection
    {
        return ChatSession::where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'updated_at']);
    }

    /**
     * Create a new session.
     */
    public function create(string $userId, string $title = 'New Conversation'): ChatSession
    {
        return ChatSession::create([
            'user_id' => $userId,
            'title' => $title,
        ]);
    }

    /**
     * Find a session owned by a user (ensures ownership).
     */
    public function findForUser(string $sessionId, string $userId): ?ChatSession
    {
        return ChatSession::where('id', $sessionId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Update session title.
     */
    public function updateTitle(string $sessionId, string $title): void
    {
        ChatSession::where('id', $sessionId)->update(['title' => $title]);
    }

    /**
     * Delete one or many sessions belonging to a user.
     */
    public function deleteMany(array $sessionIds, string $userId): int
    {
        return ChatSession::where('user_id', $userId)
            ->whereIn('id', $sessionIds)
            ->delete();
    }

    /**
     * Touch updated_at to move session to top.
     */
    public function touch(string $sessionId): void
    {
        ChatSession::where('id', $sessionId)->touch();
    }
}

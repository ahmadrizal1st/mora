<?php

namespace App\Repositories;

use App\Models\ChatMessage;
use Illuminate\Support\Collection;

class ChatMessageRepository
{
    /**
     * Get all messages for a session.
     */
    public function getBySession(string $sessionId): Collection
    {
        return ChatMessage::where('session_id', $sessionId)
            ->orderBy('created_at')
            ->get(['id', 'parent_id', 'role', 'content', 'created_at']);
    }

    /**
     * Save a new message to a session.
     */
    public function create(string $sessionId, string $role, string $content, ?array $metadata = null, ?string $parentId = null): ChatMessage
    {
        return ChatMessage::create([
            'session_id' => $sessionId,
            'parent_id'  => $parentId,
            'role'       => $role,
            'content'    => $content,
            'metadata'   => $metadata,
        ]);
    }

    /**
     * Get the last N messages in a session based on the active branch leaf.
     */
    public function getThreadContext(string $sessionId, ?string $leafId = null, int $n = 10): Collection
    {
        $leafMessage = null;
        
        if ($leafId) {
            $leafMessage = ChatMessage::where('session_id', $sessionId)->find($leafId);
        } else {
            // Default to the most recently created message
            $leafMessage = ChatMessage::where('session_id', $sessionId)->orderByDesc('created_at')->first();
        }

        if (!$leafMessage) {
            return collect([]);
        }

        $thread = [];
        $currentMessage = $leafMessage;

        while ($currentMessage && count($thread) < $n) {
            $thread[] = $currentMessage;
            if ($currentMessage->parent_id) {
                $currentMessage = ChatMessage::find($currentMessage->parent_id);
            } else {
                $currentMessage = null;
            }
        }

        return collect($thread)->reverse()->values();
    }
}

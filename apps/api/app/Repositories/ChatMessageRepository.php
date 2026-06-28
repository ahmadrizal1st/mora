<?php

namespace App\Repositories;

use App\Models\ChatMessage;
use Illuminate\Support\Collection;

class ChatMessageRepository
{
    
    public function getBySession(string $sessionId): Collection
    {
        return ChatMessage::where('session_id', $sessionId)
            ->orderBy('created_at')
            ->get(['id', 'parent_id', 'role', 'content', 'created_at']);
    }

    
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

    
    public function getThreadContext(string $sessionId, ?string $leafId = null, int $n = 10): Collection
    {
        $leafMessage = null;
        
        if ($leafId) {
            $leafMessage = ChatMessage::where('session_id', $sessionId)->find($leafId);
        } else {
            
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

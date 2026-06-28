<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\ChatService;

class ChatController extends Controller
{
    private ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    
    public function sessions(Request $request): JsonResponse
    {
        $sessions = $this->chatService->getSessions($request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $sessions
        ]);
    }

    
    public function createSession(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string|max:255'
        ]);

        $title = $request->input('title', 'New Conversation');
        $session = $this->chatService->createSession($request->user()->id, $title);

        return response()->json([
            'status' => 'success',
            'data' => $session
        ], 201);
    }

    
    public function deleteSessions(Request $request): JsonResponse
    {
        $request->validate([
            'session_ids' => 'required|array',
            'session_ids.*' => 'uuid'
        ]);

        $deleted = $this->chatService->deleteSessions($request->user()->id, $request->input('session_ids'));

        return response()->json([
            'status' => 'success',
            'message' => "{$deleted} session(s) deleted."
        ]);
    }

    
    public function messages(Request $request, string $sessionId): JsonResponse
    {
        $messages = $this->chatService->getMessages($request->user()->id, $sessionId);

        return response()->json([
            'status' => 'success',
            'data' => $messages
        ]);
    }

    
    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|uuid',
            'message' => 'required|string',
            'parent_id' => 'nullable|uuid',
        ]);

        $userMessage = $request->input('message');
        $sessionId = $request->input('session_id');
        $parentId = $request->input('parent_id');

        try {
            $data = $this->chatService->sendMessage($request->user()->id, $sessionId, $userMessage, $parentId);

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('Chat generation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate response: ' . $e->getMessage()
            ], 500);
        }
    }
}

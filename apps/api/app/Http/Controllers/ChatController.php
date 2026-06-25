<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $userMessage = $request->input('message');

        // MOCK AI Response (in a real app, call OpenAI/Anthropic API here)
        $aiResponse = "Ini adalah respons AI untuk pesan Anda: \"{$userMessage}\".\n\nUntuk saat ini, fitur LLM belum sepenuhnya diintegrasikan, namun API sudah siap.";

        return response()->json([
            'data' => [
                'role' => 'ai',
                'content' => $aiResponse,
                'timestamp' => now()->toIso8601String(),
            ]
        ]);
    }
}

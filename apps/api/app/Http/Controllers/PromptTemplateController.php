<?php

namespace App\Http\Controllers;

use App\Models\PromptTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromptTemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $templates = PromptTemplate::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $templates]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'prompt'      => 'required|string',
            'category'    => 'required|string|in:financial-analysis,investment,planning,report,other',
            'icon'        => 'nullable|string|max:64',
            'icon_color'  => 'nullable|string|max:32',
        ]);

        $template = PromptTemplate::create(array_merge($validated, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json(['status' => 'success', 'data' => $template], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $template = PromptTemplate::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'prompt'      => 'sometimes|string',
            'category'    => 'sometimes|string|in:financial-analysis,investment,planning,report,other',
            'icon'        => 'nullable|string|max:64',
            'icon_color'  => 'nullable|string|max:32',
        ]);

        $template->update($validated);

        return response()->json(['status' => 'success', 'data' => $template->fresh()]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $template = PromptTemplate::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $template->delete();

        return response()->json(['status' => 'success', 'message' => 'Template deleted.']);
    }

    /**
     * Increment usage_count when a template is used to start a chat.
     */
    public function use(Request $request, string $id): JsonResponse
    {
        $template = PromptTemplate::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $template->increment('usage_count');

        return response()->json(['status' => 'success', 'data' => $template->fresh()]);
    }
}

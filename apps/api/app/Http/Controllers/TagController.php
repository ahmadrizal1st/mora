<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * List all tags for the authenticated user.
     *
     * GET /api/tags
     */
    public function index(Request $request): JsonResponse
    {
        $tags = $request->user()
            ->tags()
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $tags,
        ]);
    }

    /**
     * Create a new tag.
     *
     * POST /api/tags
     */
    public function store(StoreTagRequest $request): JsonResponse
    {
        $tag = $request->user()->tags()->create($request->validated());

        return response()->json([
            'message' => 'Tag berhasil dibuat.',
            'data' => $tag,
        ], 201);
    }

    /**
     * Update a tag.
     *
     * PUT /api/tags/{id}
     */
    public function update(StoreTagRequest $request, int $id): JsonResponse
    {
        $tag = $request->user()->tags()->findOrFail($id);
        $tag->update($request->validated());

        return response()->json([
            'message' => 'Tag berhasil diperbarui.',
            'data' => $tag->fresh(),
        ]);
    }

    /**
     * Delete a tag.
     *
     * DELETE /api/tags/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $tag = $request->user()->tags()->findOrFail($id);
        $tag->transactions()->detach();
        $tag->delete();

        return response()->json([
            'message' => 'Tag berhasil dihapus.',
        ]);
    }
}

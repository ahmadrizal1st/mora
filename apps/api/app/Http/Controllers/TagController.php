<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Services\TagService;
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
        $tags = TagService::list($request->user());

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
        $tag = TagService::store($request->user(), $request->validated());

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
        $tag = TagService::update($request->user(), $id, $request->validated());

        return response()->json([
            'message' => 'Tag berhasil diperbarui.',
            'data' => $tag,
        ]);
    }

    /**
     * Delete a tag.
     *
     * DELETE /api/tags/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        TagService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Tag berhasil dihapus.',
        ]);
    }
}

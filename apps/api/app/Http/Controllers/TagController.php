<?php

namespace App\Http\Controllers;

use App\Data\TagData;
use App\Http\Requests\StoreTagRequest;
use App\Services\TagService;
use Spatie\LaravelData\DataCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    
    public function index(Request $request): JsonResponse
    {
        $tags = TagService::list($request->user());

        return response()->json([
            'data' => TagData::collect($tags, DataCollection::class),
        ]);
    }

    
    public function store(StoreTagRequest $request): JsonResponse
    {
        $tag = TagService::store($request->user(), $request->validated());

        return response()->json([
            'message' => 'Tag berhasil dibuat.',
            'data' => TagData::from($tag),
        ], 201);
    }

    
    public function update(StoreTagRequest $request, int $id): JsonResponse
    {
        $tag = TagService::update($request->user(), $id, $request->validated());

        return response()->json([
            'message' => 'Tag berhasil diperbarui.',
            'data' => TagData::from($tag),
        ]);
    }

    
    public function destroy(Request $request, int $id): JsonResponse
    {
        TagService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Tag berhasil dihapus.',
        ]);
    }
}

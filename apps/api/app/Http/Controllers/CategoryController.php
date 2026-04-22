<?php

namespace App\Http\Controllers;

use App\Data\CategoryData;
use App\Services\CategoryService;
use Spatie\LaravelData\DataCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * List categories, optionally filtered by tx_type.
     *
     * GET /api/categories?tx_type=expense
     */
    public function index(Request $request): JsonResponse
    {
        $categories = CategoryService::list($request->query('tx_type'));

        return response()->json([
            'data' => CategoryData::collect($categories, DataCollection::class),
        ]);
    }
}

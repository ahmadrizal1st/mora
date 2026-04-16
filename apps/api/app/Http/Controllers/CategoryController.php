<?php

namespace App\Http\Controllers;

use App\Models\Category;
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
        $query = Category::query()->orderBy('name');

        if ($request->has('tx_type')) {
            $query->byType($request->get('tx_type'));
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }
}

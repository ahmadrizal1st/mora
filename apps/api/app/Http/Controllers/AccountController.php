<?php

namespace App\Http\Controllers;

use App\Data\AccountData;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;

class AccountController extends Controller
{
    /**
     * List all accounts for the authenticated user.
     *
     * GET /api/accounts
     */
    public function index(Request $request): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $accounts = AccountService::listWithHistory($request->user(), $groupBy, $filters);

        return response()->json([
            'data' => AccountData::collect($accounts, DataCollection::class)
        ]);
    }

    /**
     * Create a new account.
     *
     * POST /api/accounts
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = AccountService::store($request->user(), $request->validated());

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'data' => AccountData::from($account),
        ], 201);
    }

    /**
     * Show a single account.
     *
     * GET /api/accounts/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $account = AccountService::showWithHistory($request->user(), $id, $groupBy, $filters);

        return response()->json([
            'data' => AccountData::from($account)
        ]);
    }

    /**
     * Update an account.
     *
     * PUT /api/accounts/{id}
     */
    public function update(UpdateAccountRequest $request, int $id): JsonResponse
    {
        $account = AccountService::update($request->user(), $id, $request->validated());

        return response()->json([
            'message' => 'Akun berhasil diperbarui.',
            'data' => AccountData::from($account),
        ]);
    }

    /**
     * Delete an account.
     *
     * DELETE /api/accounts/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        AccountService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Akun berhasil dihapus.',
        ]);
    }
    /**
     * Resolve common query parameters for account listings.
     */
    private function resolveRequestParams(Request $request): array
    {
        $groupBy = $request->query('group_by', 'day');
        if (!in_array($groupBy, ['day', 'week', 'month'])) {
            $groupBy = 'day';
        }

        $filters = array_filter([
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ]);

        return [$groupBy, $filters];
    }
}

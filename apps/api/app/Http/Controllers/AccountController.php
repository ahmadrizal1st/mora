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
    public function index(Request $request): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $accounts = AccountService::listWithHistory($request->user(), $groupBy, $filters);

        return response()->json([
            'data' => AccountData::collect($accounts, DataCollection::class)
        ]);
    }

    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = AccountService::store($request->user(), $request->validated());

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'data' => AccountData::from($account),
        ], 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        [$groupBy, $filters] = $this->resolveRequestParams($request);

        $account = AccountService::showWithHistory($request->user(), $id, $groupBy, $filters);

        return response()->json([
            'data' => AccountData::from($account)
        ]);
    }

    public function update(UpdateAccountRequest $request, string $id): JsonResponse
    {
        $account = AccountService::update($request->user(), $id, $request->validated());

        return response()->json([
            'message' => 'Akun berhasil diperbarui.',
            'data' => AccountData::from($account),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        AccountService::destroy($request->user(), $id);

        return response()->json([
            'message' => 'Akun berhasil dihapus.',
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        return response()->json([
            'data' => AccountService::summary($request->user())
        ]);
    }

    public function analytics(Request $request): JsonResponse
    {
        $analytics = AccountService::analytics(
            $request->user(),
            $request->query('account_id'),
            $request->query('month'),
            $request->query('year')
        );

        return response()->json([
            'data' => $analytics
        ]);
    }

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

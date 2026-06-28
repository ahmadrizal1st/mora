<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\User;
use App\Repositories\AssetRepository;

class AssetService
{
    public static function list(User $user)
    {
        return AssetRepository::getAllForUser($user);
    }

    public static function store(User $user, array $data): Asset
    {
        return $user->assets()->create($data);
    }

    public static function show(User $user, string $id): Asset
    {
        return AssetRepository::findForUser($user, $id);
    }

    public static function update(User $user, string $id, array $data): Asset
    {
        $asset = AssetRepository::findForUser($user, $id);
        $asset->update($data);
        return $asset->fresh();
    }

    public static function destroy(User $user, string $id): void
    {
        $asset = AssetRepository::findForUser($user, $id);
        $asset->delete();
    }
}

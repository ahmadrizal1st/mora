<?php

namespace App\Repositories;

use App\Models\Asset;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AssetRepository
{
    public static function queryForUser(User $user): QueryBuilder
    {
        return QueryBuilder::for(Asset::class)
            ->where('user_id', $user->id)
            ->allowedFilters(AllowedFilter::partial('name'), 'category')
            ->allowedSorts('name', 'value', 'created_at');
    }

    public static function getAllForUser(User $user)
    {
        return self::queryForUser($user)
            ->defaultSort('-created_at')
            ->get();
    }

    public static function findForUser(User $user, string $id): Asset
    {
        return self::queryForUser($user)
            ->findOrFail($id);
    }
}

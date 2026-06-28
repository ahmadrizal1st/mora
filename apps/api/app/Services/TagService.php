<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\User;
use App\Repositories\TagRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TagService
{
    
    public static function list(User $user): Collection
    {
        return TagRepository::getAllForUser($user);
    }

    
    public static function store(User $user, array $data): Tag
    {
        return TagRepository::store($user, $data);
    }

    
    public static function update(User $user, string $id, array $data): Tag
    {
        $tag = TagRepository::findById($user, $id);
        if (!$tag) {
            throw (new ModelNotFoundException())->setModel(Tag::class);
        }
        return TagRepository::update($tag, $data);
    }

    
    public static function destroy(User $user, string $id): void
    {
        $tag = TagRepository::findById($user, $id);
        if (!$tag) {
            throw (new ModelNotFoundException())->setModel(Tag::class);
        }
        TagRepository::destroy($tag);
    }
}

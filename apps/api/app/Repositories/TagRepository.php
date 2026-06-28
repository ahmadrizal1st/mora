<?php

namespace App\Repositories;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TagRepository
{
    
    public static function getAllForUser(User $user): Collection
    {
        return $user->tags()
            ->orderBy('name')
            ->get();
    }

    
    public static function store(User $user, array $data): Tag
    {
        return $user->tags()->create($data);
    }

    
    public static function findById(User $user, string $id): ?Tag
    {
        return $user->tags()->find($id);
    }

    
    public static function update(Tag $tag, array $data): Tag
    {
        $tag->update($data);
        return $tag->fresh();
    }

    
    public static function destroy(Tag $tag): void
    {
        $tag->transactions()->detach();
        $tag->delete();
    }
}

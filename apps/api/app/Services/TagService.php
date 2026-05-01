<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\User;
use App\Repositories\TagRepository;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    /**
     * List all tags for the user.
     */
    public static function list(User $user): Collection
    {
        return TagRepository::getAllForUser($user);
    }

    /**
     * Create a new tag.
     */
    public static function store(User $user, array $data): Tag
    {
        return $user->tags()->create($data);
    }

    /**
     * Update a tag.
     */
    public static function update(User $user, string $id, array $data): Tag
    {
        $tag = $user->tags()->findOrFail($id);
        $tag->update($data);
        return $tag->fresh();
    }

    /**
     * Delete a tag.
     */
    public static function destroy(User $user, string $id): void
    {
        $tag = $user->tags()->findOrFail($id);
        $tag->transactions()->detach();
        $tag->delete();
    }
}

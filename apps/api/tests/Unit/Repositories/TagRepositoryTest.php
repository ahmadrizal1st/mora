<?php

namespace Tests\Unit\Repositories;

use App\Models\Tag;
use App\Models\User;
use App\Repositories\TagRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TagRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_tags_for_user(): void
    {
        $user = User::factory()->create();
        Tag::factory()->count(3)->for($user)->create();
        Tag::factory()->count(2)->create();

        $tags = TagRepository::getAllForUser($user);

        $this->assertCount(3, $tags);
    }

    public function test_can_store_tag(): void
    {
        $user = User::factory()->create();
        $data = [
            'name' => 'Test Tag',
            'color' => '#ffffff',
        ];

        $tag = TagRepository::store($user, $data);

        $this->assertInstanceOf(Tag::class, $tag);
        $this->assertEquals($data['name'], $tag->name);
        $this->assertEquals($data['color'], $tag->color);
    }

    public function test_can_find_tag_for_user(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->for($user)->create();

        $foundTag = TagRepository::findById($user, $tag->id);

        $this->assertEquals($tag->id, $foundTag->id);
    }

    public function test_can_update_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->for($user)->create([
            'name' => 'Old Name',
            'color' => '#000000',
        ]);

        $updatedTag = TagRepository::update($tag, [
            'name' => 'New Name',
            'color' => '#ffffff',
        ]);

        $this->assertEquals('New Name', $updatedTag->name);
        $this->assertEquals('#ffffff', $updatedTag->color);
    }

    public function test_can_destroy_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->for($user)->create();

        TagRepository::destroy($tag);

        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }
}

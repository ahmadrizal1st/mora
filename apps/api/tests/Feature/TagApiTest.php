<?php

namespace Tests\Feature;

use App\Models\Tag;
use App\Models\User;
use Tests\TestCase;
use Tests\Traits\WithAuthentication;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TagApiTest extends TestCase
{
    use RefreshDatabase, WithAuthentication;

    public function test_can_list_tags(): void
    {
        $user = $this->authenticate();
        Tag::factory()->count(3)->for($user)->create();

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_store_tag(): void
    {
        $user = $this->authenticate();
        $data = [
            'name' => 'New Tag',
            'color' => '#ff0000',
        ];

        $response = $this->postJson('/api/tags', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('tags', $data);
    }

    public function test_store_tag_requires_name(): void
    {
        $this->authenticate();

        $response = $this->postJson('/api/tags', [
            'color' => '#ff0000',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_can_update_tag(): void
    {
        $user = $this->authenticate();
        $tag = Tag::factory()->for($user)->create();
        $data = [
            'name' => 'Updated Tag',
            'color' => '#00ff00',
        ];

        $response = $this->putJson("/api/tags/{$tag->id}", $data);

        $response->assertOk();
        $this->assertDatabaseHas('tags', $data);
    }

    public function test_cannot_update_other_users_tag(): void
    {
        $this->authenticate();
        $otherUser = User::factory()->create();
        $tag = Tag::factory()->for($otherUser)->create();

        $response = $this->putJson("/api/tags/{$tag->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertNotFound();
    }

    public function test_can_destroy_tag(): void
    {
        $user = $this->authenticate();
        $tag = Tag::factory()->for($user)->create();

        $response = $this->deleteJson("/api/tags/{$tag->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }
}

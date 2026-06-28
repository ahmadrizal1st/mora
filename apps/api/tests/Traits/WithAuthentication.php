<?php

namespace Tests\Traits;

use App\Models\User;

trait WithAuthentication
{
    protected function authenticate(?User $user = null): User
    {
        $user = $user ?? User::factory()->create();
        $this->actingAs($user, 'sanctum');
        return $user;
    }
}

<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->withHeader('X-API-KEY', env('API_KEY', 'test_api_key'));
    }
}

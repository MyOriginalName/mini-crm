<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Настройка SQLite в памяти
        config([
            'database.connections.sqlite' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
            ],
            'database.default' => 'sqlite',
        ]);
    }
}

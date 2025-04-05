<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;

class UserTest extends TestCase
{
    use WithFaker;

    /** @test */
    public function it_can_create_a_user()
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'),
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($userData['name'], $user->name);
        $this->assertEquals($userData['email'], $user->email);
        $this->assertDatabaseHas('users', [
            'email' => $userData['email'],
            'name' => $userData['name'],
        ]);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $user = User::factory()->create();
        
        $newName = $this->faker->name;
        $user->update(['name' => $newName]);

        $this->assertEquals($newName, $user->fresh()->name);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => $newName,
        ]);
    }

    /** @test */
    public function it_can_delete_a_user()
    {
        $user = User::factory()->create();
        
        $userId = $user->id;
        $user->delete();

        $this->assertDatabaseMissing('users', [
            'id' => $userId,
        ]);
    }
} 
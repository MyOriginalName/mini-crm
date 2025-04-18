<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;

class ClientTest extends TestCase
{
    use WithFaker;

    /** @test */
    public function it_can_create_a_client()
    {
        $user = User::factory()->create();
        
        $clientData = [
            'name' => $this->faker->company,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'user_id' => $user->id,
            'type' => 'individual',
            'status' => 'active',
        ];

        $client = Client::create($clientData);

        $this->assertInstanceOf(Client::class, $client);
        $this->assertEquals($clientData['name'], $client->name);
        $this->assertEquals($clientData['email'], $client->email);
        $this->assertEquals($clientData['user_id'], $client->user_id);
        $this->assertDatabaseHas('clients', [
            'email' => $clientData['email'],
            'name' => $clientData['name'],
        ]);
    }

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $client->user);
        $this->assertEquals($user->id, $client->user->id);
    }

    /** @test */
    public function it_can_update_a_client()
    {
        $client = Client::factory()->create();
        
        $newName = $this->faker->company;
        $client->update(['name' => $newName]);

        $this->assertEquals($newName, $client->fresh()->name);
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => $newName,
        ]);
    }

    /** @test */
    public function it_can_delete_a_client()
    {
        $client = Client::factory()->create();
        
        $clientId = $client->id;
        $client->delete();

        $this->assertSoftDeleted('clients', [
            'id' => $clientId,
        ]);
    }
} 
<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Client;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('api-token')->plainTextToken;
    }

    public function test_can_get_clients_list()
    {
        Client::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/clients');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_filter_clients_by_search()
    {
        Client::factory()->create(['name' => 'John Doe']);
        Client::factory()->create(['name' => 'Jane Smith']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/clients?search=John');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'John Doe']);
    }

    public function test_can_filter_clients_by_type()
    {
        Client::factory()->create(['type' => 'individual']);
        Client::factory()->create(['type' => 'company']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/clients?type=individual');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['type' => 'individual']);
    }

    public function test_can_create_client()
    {
        $tag = Tag::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/clients', [
            'name' => 'Test Client',
            'email' => 'test@example.com',
            'phone' => '+1234567890',
            'type' => 'individual',
            'status' => 'active',
            'tags' => [$tag->id],
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Test Client',
                'email' => 'test@example.com',
                'type' => 'individual',
                'status' => 'active',
            ]);

        $this->assertDatabaseHas('clients', [
            'email' => 'test@example.com',
            'name' => 'Test Client',
        ]);
    }

    public function test_cannot_create_client_with_invalid_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/clients', [
            'name' => '',
            'email' => 'invalid-email',
            'type' => 'invalid-type',
            'status' => 'invalid-status',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'type', 'status']);
    }

    public function test_can_get_client_details()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/clients/{$client->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
            ]);
    }

    public function test_can_update_client()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/clients/{$client->id}", [
            'name' => 'Updated Name',
            'email' => $client->email,
            'type' => $client->type,
            'status' => $client->status,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Name',
            ]);

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_can_delete_client()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/v1/clients/{$client->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('clients', [
            'id' => $client->id,
        ]);
    }

    public function test_can_update_client_tags()
    {
        $client = Client::factory()->create();
        $tags = Tag::factory()->count(2)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/v1/clients/{$client->id}/tags", [
            'tags' => $tags->pluck('id')->toArray(),
        ]);

        $response->assertStatus(200);

        $this->assertEquals(2, $client->tags()->count());
    }

    public function test_unauthenticated_user_cannot_access_clients()
    {
        $response = $this->getJson('/api/v1/clients');

        $response->assertStatus(401);
    }
} 
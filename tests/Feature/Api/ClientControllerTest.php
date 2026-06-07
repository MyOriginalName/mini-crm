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
    private $userWithoutPermission;
    private $tokenWithoutPermission;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('api-token')->plainTextToken;
        $this->user->givePermissionTo([
            'view clients',
            'view own clients',
            'create clients',
            'edit clients',
            'edit own clients',
            'delete clients',
            'delete own clients',
        ]);

        $this->userWithoutPermission = User::factory()->create();
        $this->tokenWithoutPermission = $this->userWithoutPermission->createToken('api-token')->plainTextToken;
    }

    public function test_unauthenticated_user_cannot_access_clients()
    {
        $response = $this->getJson('/api/v1/clients');
        $response->assertStatus(401);
    }

    public function test_user_without_permission_cannot_view_clients()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->getJson('/api/v1/clients');

        $response->assertStatus(403);
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

    public function test_user_without_permission_cannot_create_client()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->postJson('/api/v1/clients', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '+1234567890',
            'type' => 'individual',
            'status' => 'active',
        ]);

        $response->assertStatus(403);
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

    public function test_user_without_permission_cannot_view_client_details()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->getJson("/api/v1/clients/{$client->id}");

        $response->assertStatus(403);
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

    public function test_user_without_permission_cannot_update_client()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->putJson("/api/v1/clients/{$client->id}", [
            'name' => 'Updated Name',
            'email' => $client->email,
            'type' => $client->type,
            'status' => $client->status,
        ]);

        $response->assertStatus(403);
    }

    public function test_can_update_client()
    {
        $client = Client::factory()->create(['type' => 'individual']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/clients/{$client->id}", [
            'name' => 'Updated Name',
            'email' => $client->email,
            'type' => 'individual',
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

    public function test_user_without_permission_cannot_delete_client()
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->deleteJson("/api/v1/clients/{$client->id}");

        $response->assertStatus(403);
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
        ])->putJson("/api/v1/clients/{$client->id}/tags", [
            'tags' => $tags->pluck('id')->toArray(),
        ]);

        $response->assertStatus(200);

        $this->assertEquals(2, $client->tags()->count());
    }

    public function test_can_get_clients_widget()
    {
        Client::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/clients/widget');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_client_via_widget()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/clients/widget', [
            'name' => 'Widget Client',
            'email' => 'widget@example.com',
            'phone' => '+79991112233',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Widget Client',
            ]);

        $this->assertDatabaseHas('clients', [
            'email' => 'widget@example.com',
            'type' => 'individual',
            'status' => 'active',
        ]);
    }

    public function test_can_export_clients()
    {
        Client::factory()->count(2)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/clients/export');

        $response->assertStatus(200);
    }

    public function test_user_without_permission_cannot_export_clients()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->getJson('/api/v1/clients/export');

        $response->assertStatus(403);
    }
}

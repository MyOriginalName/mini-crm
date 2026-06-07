<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Deal;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DealControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;
    private $userWithoutPermission;
    private $tokenWithoutPermission;
    private $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('api-token')->plainTextToken;
        $this->user->givePermissionTo([
            'view deals',
            'view own deals',
            'create deals',
            'edit deals',
            'edit own deals',
            'delete deals',
            'delete own deals',
        ]);

        $this->userWithoutPermission = User::factory()->create();
        $this->tokenWithoutPermission = $this->userWithoutPermission->createToken('api-token')->plainTextToken;

        $this->client = Client::factory()->create(['user_id' => $this->user->id]);
    }

    public function test_unauthenticated_user_cannot_access_deals()
    {
        $response = $this->getJson('/api/v1/deals');
        $response->assertStatus(401);
    }

    public function test_user_without_permission_cannot_view_deals()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->getJson('/api/v1/deals');

        $response->assertStatus(403);
    }

    public function test_can_get_deals_list()
    {
        Deal::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/deals');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'status', 'value'],
                ],
                'current_page',
                'per_page',
                'total',
            ]);
    }

    public function test_can_filter_deals_by_status()
    {
        Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'status' => 'in_progress',
        ]);
        Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'status' => 'won',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/deals?status=won');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'won');
    }

    public function test_can_search_deals()
    {
        Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'name' => 'Big Project Deal',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/deals?search=Big');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Big Project Deal');
    }

    public function test_user_without_permission_cannot_create_deal()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->postJson('/api/v1/deals', [
            'name' => 'New Deal',
            'client_id' => $this->client->id,
            'value' => 5000,
            'status' => 'in_progress',
        ]);

        $response->assertStatus(403);
    }

    public function test_can_create_deal()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/deals', [
            'name' => 'New Deal',
            'client_id' => $this->client->id,
            'value' => 5000.00,
            'status' => 'in_progress',
            'description' => 'Test description',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Deal',
                'status' => 'in_progress',
                'value' => 5000.00,
            ]);

        $this->assertDatabaseHas('deals', [
            'name' => 'New Deal',
            'client_id' => $this->client->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_cannot_create_deal_with_invalid_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/deals', [
            'name' => '',
            'client_id' => 999,
            'value' => -100,
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'client_id', 'value', 'status']);
    }

    public function test_user_without_permission_cannot_view_deal_details()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->getJson("/api/v1/deals/{$deal->id}");

        $response->assertStatus(403);
    }

    public function test_can_get_deal_details()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/deals/{$deal->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $deal->id,
                'name' => $deal->name,
                'client' => [
                    'id' => $this->client->id,
                    'name' => $this->client->name,
                ],
            ]);
    }

    public function test_user_without_permission_cannot_update_deal()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->putJson("/api/v1/deals/{$deal->id}", [
            'name' => 'Updated Deal',
        ]);

        $response->assertStatus(403);
    }

    public function test_can_update_deal()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/deals/{$deal->id}", [
            'name' => 'Updated Deal',
            'value' => 9999.99,
            'status' => 'won',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Deal',
                'status' => 'won',
            ]);

        $this->assertDatabaseHas('deals', [
            'id' => $deal->id,
            'name' => 'Updated Deal',
            'value' => 9999.99,
        ]);
    }

    public function test_can_update_deal_status()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'status' => 'in_progress',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/deals/{$deal->id}/status", [
            'status' => 'won',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $deal->id,
                'status' => 'won',
            ]);
    }

    public function test_cannot_update_deal_status_with_invalid_data()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/deals/{$deal->id}/status", [
            'status' => 'invalid',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_user_without_permission_cannot_delete_deal()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenWithoutPermission,
        ])->deleteJson("/api/v1/deals/{$deal->id}");

        $response->assertStatus(403);
    }

    public function test_can_delete_deal()
    {
        $deal = Deal::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/v1/deals/{$deal->id}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('deals', [
            'id' => $deal->id,
        ]);
    }
}

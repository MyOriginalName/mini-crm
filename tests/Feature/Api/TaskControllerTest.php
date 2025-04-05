<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Task;
use App\Models\Client;
use App\Models\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;
    private $client;
    private $deal;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('api-token')->plainTextToken;
        $this->client = Client::factory()->create();
        $this->deal = Deal::factory()->create([
            'client_id' => $this->client->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_get_tasks_list()
    {
        Task::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'status',
                        'priority',
                        'deadline',
                        'user' => [
                            'id',
                            'name',
                        ],
                        'client' => [
                            'id',
                            'name',
                        ],
                        'deal' => [
                            'id',
                            'name',
                        ],
                    ],
                ],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                ],
            ]);
    }

    public function test_can_filter_tasks_by_status()
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'status' => 'todo',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'status' => 'done',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/tasks?status=todo');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'todo');
    }

    public function test_can_filter_tasks_by_priority()
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'priority' => 'high',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'priority' => 'low',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/v1/tasks?priority=high');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.priority', 'high');
    }

    public function test_can_create_task()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/tasks', [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'todo',
            'priority' => 'high',
            'deadline' => now()->addDays(7)->format('Y-m-d'),
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Test Task',
                'status' => 'todo',
                'priority' => 'high',
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_cannot_create_task_with_invalid_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/v1/tasks', [
            'title' => '',
            'status' => 'invalid_status',
            'priority' => 'invalid_priority',
            'deadline' => 'invalid_date',
            'client_id' => 999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'status', 'priority', 'deadline', 'client_id']);
    }

    public function test_can_get_task_details()
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $task->id,
                'title' => $task->title,
                'user' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ],
                'client' => [
                    'id' => $this->client->id,
                    'name' => $this->client->name,
                ],
                'deal' => [
                    'id' => $this->deal->id,
                    'name' => $this->deal->name,
                ],
            ]);
    }

    public function test_can_update_task()
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/v1/tasks/{$task->id}", [
            'title' => 'Updated Task',
            'status' => 'done',
            'priority' => 'low',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'title' => 'Updated Task',
                'status' => 'done',
                'priority' => 'low',
            ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task',
            'status' => 'done',
            'priority' => 'low',
        ]);
    }

    public function test_can_delete_task()
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_tasks()
    {
        $response = $this->getJson('/api/v1/tasks');

        $response->assertStatus(401);
    }
} 
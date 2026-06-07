<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Task;
use App\Models\Client;
use App\Models\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Client $client;
    private Deal $deal;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);

        $this->user = User::factory()->create();
        $this->client = Client::factory()->create([
            'type' => 'individual',
            'status' => 'active',
        ]);
        $this->deal = Deal::factory()->create([
            'client_id' => $this->client->id,
            'user_id' => $this->user->id,
        ]);

        $this->user->givePermissionTo([
            'view tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',
        ]);
    }

    public function test_can_create_task(): void
    {
        $this->actingAs($this->user);

        $response = $this->post(route('tasks.store'), [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => now()->addDays(7)->format('Y-m-d'),
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
        ]);

        $response->assertRedirect(route('tasks.show', Task::first()));

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'client_id' => $this->client->id,
            'deal_id' => $this->deal->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_create_task_without_optional_client_and_deal(): void
    {
        $this->actingAs($this->user);

        $response = $this->post(route('tasks.store'), [
            'title' => 'Standalone Task',
            'description' => 'No client or deal',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        $response->assertRedirect(route('tasks.show', Task::first()));

        $this->assertDatabaseHas('tasks', [
            'title' => 'Standalone Task',
            'client_id' => null,
            'deal_id' => null,
        ]);
    }

    public function test_cannot_create_task_without_create_permission(): void
    {
        $userWithoutPermission = User::factory()->create();
        $userWithoutPermission->givePermissionTo(['view tasks']);

        $this->actingAs($userWithoutPermission);

        $response = $this->post(route('tasks.store'), [
            'title' => 'Test Task',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        $response->assertStatus(403);
    }

    public function test_cannot_create_task_with_invalid_data(): void
    {
        $this->actingAs($this->user);

        $response = $this->post(route('tasks.store'), [
            'title' => '',
            'status' => 'invalid_status',
            'priority' => 'invalid_priority',
            'due_date' => 'not-a-date',
            'client_id' => 99999,
        ]);

        $response->assertSessionHasErrors(['title', 'status', 'priority', 'due_date', 'client_id']);
    }

    public function test_unauthenticated_user_cannot_create_task(): void
    {
        $response = $this->post(route('tasks.store'), [
            'title' => 'Test Task',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        $response->assertRedirect(route('login'));
    }
}

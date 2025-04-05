<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Task;
use App\Models\User;
use App\Models\Client;
use Illuminate\Foundation\Testing\WithFaker;

class TaskTest extends TestCase
{
    use WithFaker;

    /** @test */
    public function it_can_create_a_task()
    {
        $user = User::factory()->create();
        $client = Client::factory()->create();
        
        $taskData = [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => now()->addDays(7),
            'user_id' => $user->id,
            'client_id' => $client->id,
        ];

        $task = Task::create($taskData);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertEquals($taskData['title'], $task->title);
        $this->assertEquals($taskData['status'], $task->status);
        $this->assertDatabaseHas('tasks', [
            'title' => $taskData['title'],
            'user_id' => $taskData['user_id'],
        ]);
    }

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }

    /** @test */
    public function it_belongs_to_a_client()
    {
        $client = Client::factory()->create();
        $task = Task::factory()->create(['client_id' => $client->id]);

        $this->assertInstanceOf(Client::class, $task->client);
        $this->assertEquals($client->id, $task->client->id);
    }

    /** @test */
    public function it_can_update_task_status()
    {
        $task = Task::factory()->create(['status' => 'pending']);
        
        $task->update(['status' => 'completed']);

        $this->assertEquals('completed', $task->fresh()->status);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }

    /** @test */
    public function it_can_delete_a_task()
    {
        $task = Task::factory()->create();
        
        $taskId = $task->id;
        $task->delete();

        $this->assertSoftDeleted('tasks', [
            'id' => $taskId,
        ]);
    }
} 
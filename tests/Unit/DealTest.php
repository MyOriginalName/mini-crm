<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Deal;
use App\Models\User;
use App\Models\Client;
use Illuminate\Foundation\Testing\WithFaker;

class DealTest extends TestCase
{
    use WithFaker;

    /** @test */
    public function it_can_create_a_deal()
    {
        $user = User::factory()->create();
        $client = Client::factory()->create();
        
        $dealData = [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => 'active',
            'amount' => $this->faker->randomFloat(2, 1000, 10000),
            'user_id' => $user->id,
            'client_id' => $client->id,
        ];

        $deal = Deal::create($dealData);

        $this->assertInstanceOf(Deal::class, $deal);
        $this->assertEquals($dealData['title'], $deal->title);
        $this->assertEquals($dealData['status'], $deal->status);
        $this->assertEquals($dealData['amount'], $deal->amount);
        $this->assertDatabaseHas('deals', [
            'title' => $dealData['title'],
            'user_id' => $dealData['user_id'],
        ]);
    }

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $deal = Deal::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $deal->user);
        $this->assertEquals($user->id, $deal->user->id);
    }

    /** @test */
    public function it_belongs_to_a_client()
    {
        $client = Client::factory()->create();
        $deal = Deal::factory()->create(['client_id' => $client->id]);

        $this->assertInstanceOf(Client::class, $deal->client);
        $this->assertEquals($client->id, $deal->client->id);
    }

    /** @test */
    public function it_can_update_deal_status()
    {
        $deal = Deal::factory()->create(['status' => 'active']);
        
        $deal->update(['status' => 'completed']);

        $this->assertEquals('completed', $deal->fresh()->status);
        $this->assertDatabaseHas('deals', [
            'id' => $deal->id,
            'status' => 'completed',
        ]);
    }

    /** @test */
    public function it_can_delete_a_deal()
    {
        $deal = Deal::factory()->create();
        
        $dealId = $deal->id;
        $deal->delete();

        $this->assertSoftDeleted('deals', [
            'id' => $dealId,
        ]);
    }
} 
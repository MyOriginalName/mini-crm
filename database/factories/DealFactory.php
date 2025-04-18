<?php

namespace Database\Factories;

use App\Models\Deal;
use App\Models\User;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class DealFactory extends Factory
{
    protected $model = Deal::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['in_progress', 'won', 'lost', 'suspended']),
            'value' => $this->faker->randomFloat(2, 1000, 10000),
            'user_id' => User::factory(),
            'client_id' => Client::factory(),
        ];
    }
} 
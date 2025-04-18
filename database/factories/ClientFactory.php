<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['individual', 'company']),
            'status' => $this->faker->randomElement(['active', 'inactive', 'blocked']),
        ];
    }
}

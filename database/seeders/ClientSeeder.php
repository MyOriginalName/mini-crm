<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ClientSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('ru_RU');

        // Создаем 5 клиентов
        for ($i = 0; $i < 5; $i++) {
            $type = $faker->randomElement(['individual', 'company']);
            $status = $faker->randomElement(['active', 'inactive', 'blocked']);

            $clientData = [
                'name' => $type === 'individual' 
                    ? $faker->name 
                    : $faker->company,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'type' => $type,
                'status' => $status,
                'company_name' => $type === 'company' ? $faker->company : null,
                'inn' => $type === 'company' ? $faker->numerify('##########') : null,
                'kpp' => $type === 'company' ? $faker->numerify('#########') : null,
                'address' => $faker->address,
                'description' => $faker->paragraph,
                'user_id' => $faker->numberBetween(1, 3), // Предполагаем, что у нас есть пользователи с ID от 1 до 3
            ];

            Client::create($clientData);
        }
    }
} 
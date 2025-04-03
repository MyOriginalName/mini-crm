<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Deal;
use App\Models\User;
use Illuminate\Database\Seeder;

class DealSeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all();
        
        $statuses = ['in_progress', 'won', 'lost'];
        
        // Создаем 5 тестовых сделок
        for ($i = 1; $i <= 5; $i++) {
            $client = $clients->random();
            
            Deal::create([
                'name' => "Сделка {$i}",
                'client_id' => $client->id,
                'user_id' => 1, // Привязываем к первому пользователю
                'value' => rand(10000, 100000),
                'status' => $statuses[array_rand($statuses)],
                'description' => "Описание сделки {$i}",
            ]);
        }
    }
} 
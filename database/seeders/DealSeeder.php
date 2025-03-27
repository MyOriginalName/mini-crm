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
        $users = User::all();
        $clients = Client::all();
        
        $statuses = ['suspended', 'in_progress', 'won', 'lost'];
        
        // Создаем 20 тестовых сделок
        for ($i = 1; $i <= 20; $i++) {
            $user = $users->random();
            $client = $clients->random();
            
            Deal::create([
                'name' => "Сделка {$i}",
                'client_id' => $client->id,
                'user_id' => $user->id,
                'value' => rand(10000, 1000000),
                'status' => $statuses[array_rand($statuses)],
                'description' => "Описание сделки {$i}",
            ]);
        }
    }
} 
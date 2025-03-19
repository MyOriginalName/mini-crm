<?php

namespace Database\Seeders;

use App\Models\Deal;
use App\Models\Client;
use Illuminate\Database\Seeder;

class DealSeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all();
        $statuses = ['suspended', 'in_progress', 'won', 'lost'];

        foreach ($clients as $client) {
            // Создаем 1-3 сделки для каждого клиента
            $dealCount = rand(1, 3);
            
            for ($i = 0; $i < $dealCount; $i++) {
                Deal::create([
                    'name' => "Сделка #" . rand(1000, 9999),
                    'client_id' => $client->id,
                    'value' => rand(10000, 1000000),
                    'status' => $statuses[array_rand($statuses)],
                    'description' => "Тестовая сделка для клиента {$client->name}"
                ]);
            }
        }
    }
} 
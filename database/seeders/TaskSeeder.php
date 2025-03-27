<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Deal;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $clients = Client::all();
        $deals = Deal::all();
        
        $priorities = ['low', 'medium', 'high'];
        $statuses = ['pending', 'in_progress', 'completed'];
        
        // Создаем 30 тестовых задач
        for ($i = 1; $i <= 30; $i++) {
            $user = $users->random();
            $client = $clients->random();
            $deal = $deals->random();
            
            Task::create([
                'title' => "Задача {$i}",
                'description' => "Описание задачи {$i}",
                'client_id' => $client->id,
                'deal_id' => $deal->id,
                'user_id' => $user->id,
                'priority' => $priorities[array_rand($priorities)],
                'status' => $statuses[array_rand($statuses)],
                'due_date' => now()->addDays(rand(1, 30)),
            ]);
        }
    }
} 
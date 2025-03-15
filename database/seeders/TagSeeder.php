<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            [
                'name' => 'Горячий клиент',
                'color' => '#ef4444', // red
            ],
            [
                'name' => 'Теплый клиент',
                'color' => '#f97316', // orange
            ],
            [
                'name' => 'Холодный клиент',
                'color' => '#3b82f6', // blue
            ],
            [
                'name' => 'Успешная сделка',
                'color' => '#22c55e', // green
            ],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag['name']],
                ['color' => $tag['color']]
            );
        }
    }
}

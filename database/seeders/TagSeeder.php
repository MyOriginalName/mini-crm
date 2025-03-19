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
                'name' => 'VIP',
                'color' => '#FFD700',
            ],
            [
                'name' => 'Новый',
                'color' => '#4CAF50',
            ],
            [
                'name' => 'Потенциальный',
                'color' => '#2196F3',
            ],
            [
                'name' => 'Активный',
                'color' => '#9C27B0',
            ],
            [
                'name' => 'Неактивный',
                'color' => '#607D8B',
            ],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}

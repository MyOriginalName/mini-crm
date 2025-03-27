<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Сначала создаем разрешения
        $this->call([
            PermissionSeeder::class,
        ]);

        // Затем создаем роли
        $this->call([
            RoleSeeder::class,
        ]);

        // Затем создаем тестовых пользователей
        $this->call([
            TestUserSeeder::class,
        ]);

        // Создаем тестовые данные
        $this->call([
            ClientSeeder::class,
            DealSeeder::class,
            TaskSeeder::class,
        ]);
    }
}

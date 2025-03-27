<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Создаем администратора
        $admin = User::create([
            'name' => 'Администратор',
            'email' => 'admin@demo.com',
            'password' => Hash::make('admin123'),
        ]);
        $admin->assignRole('admin');

        // Создаем менеджера
        $manager = User::create([
            'name' => 'Менеджер',
            'email' => 'manager@demo.com',
            'password' => Hash::make('manager123'),
        ]);
        $manager->assignRole('manager');

        // Создаем пользователя
        $user = User::create([
            'name' => 'Пользователь',
            'email' => 'user@demo.com',
            'password' => Hash::make('user123'),
        ]);
        $user->assignRole('user');
    }
} 
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Создаем администратора
        $admin = User::create([
            'name' => 'Администратор',
            'email' => 'admin@demo.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Создаем менеджера
        $manager = User::create([
            'name' => 'Менеджер',
            'email' => 'manager@demo.com',
            'password' => Hash::make('manager123'),
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('manager');

        // Создаем обычного пользователя
        $user = User::create([
            'name' => 'Пользователь',
            'email' => 'user@demo.com',
            'password' => Hash::make('user123'),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('user');
    }
} 
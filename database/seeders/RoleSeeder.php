<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Роль администратора
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'manage users',
            'create users',
            'edit users',
            'delete users',
            'view users',
            'manage clients',
            'create clients',
            'edit clients',
            'delete clients',
            'view clients',
            'manage deals',
            'create deals',
            'edit deals',
            'delete deals',
            'view deals',
            'manage tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',
            'view tasks'
        ]);

        // Роль менеджера
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view users',
            'manage clients',
            'create clients',
            'edit clients',
            'view clients',
            'manage deals',
            'create deals',
            'edit deals',
            'view deals',
            'manage tasks',
            'create tasks',
            'edit tasks',
            'view tasks'
        ]);

        // Роль пользователя
        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view clients',
            'view deals',
            'view tasks',
            'create tasks',
            'edit own tasks',
            'view own tasks'
        ]);
    }
} 
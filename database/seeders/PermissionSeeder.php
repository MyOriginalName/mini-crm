<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Разрешения для управления пользователями
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'view users']);

        // Разрешения для управления клиентами
        Permission::create(['name' => 'manage clients']);
        Permission::create(['name' => 'create clients']);
        Permission::create(['name' => 'edit clients']);
        Permission::create(['name' => 'delete clients']);
        Permission::create(['name' => 'view clients']);

        // Разрешения для управления сделками
        Permission::create(['name' => 'manage deals']);
        Permission::create(['name' => 'create deals']);
        Permission::create(['name' => 'edit deals']);
        Permission::create(['name' => 'delete deals']);
        Permission::create(['name' => 'view deals']);

        // Разрешения для управления задачами
        Permission::create(['name' => 'manage tasks']);
        Permission::create(['name' => 'create tasks']);
        Permission::create(['name' => 'edit tasks']);
        Permission::create(['name' => 'delete tasks']);
        Permission::create(['name' => 'view tasks']);
        Permission::create(['name' => 'edit own tasks']);
        Permission::create(['name' => 'view own tasks']);
    }
} 
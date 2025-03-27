<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Создаем разрешения для пользователей
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'view users']);

        // Создаем разрешения для клиентов
        Permission::create(['name' => 'create clients']);
        Permission::create(['name' => 'edit clients']);
        Permission::create(['name' => 'delete clients']);
        Permission::create(['name' => 'view clients']);
        Permission::create(['name' => 'view own clients']);

        // Создаем разрешения для сделок
        Permission::create(['name' => 'view deals']);
        Permission::create(['name' => 'view own deals']);
        Permission::create(['name' => 'create deals']);
        Permission::create(['name' => 'edit deals']);
        Permission::create(['name' => 'edit own deals']);
        Permission::create(['name' => 'delete deals']);

        // Создаем разрешения для задач
        Permission::create(['name' => 'view tasks']);
        Permission::create(['name' => 'view own tasks']);
        Permission::create(['name' => 'create tasks']);
        Permission::create(['name' => 'edit tasks']);
        Permission::create(['name' => 'edit own tasks']);
        Permission::create(['name' => 'delete tasks']);
        Permission::create(['name' => 'assign tasks']);

        // Создаем разрешения для настроек
        Permission::create(['name' => 'manage settings']);

        // Создаем роли и назначаем разрешения

        // Администратор
        $adminRole = Role::create(['name' => 'administrator']);
        $adminRole->givePermissionTo([
            'manage users',
            'view users',
            'view deals',
            'create deals',
            'edit deals',
            'delete deals',
            'view tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',
            'assign tasks',
        ]);

        // Менеджер
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view users',
            'view deals',
            'create deals',
            'edit deals',
            'view tasks',
            'create tasks',
            'edit tasks',
            'assign tasks',
        ]);

        // Агент
        $agentRole = Role::create(['name' => 'agent']);
        $agentRole->givePermissionTo([
            'view own deals',
            'create deals',
            'edit own deals',
            'view own tasks',
            'create tasks',
            'edit own tasks',
        ]);
    }
}

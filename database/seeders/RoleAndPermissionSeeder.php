<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder creates default roles and assigns them to test users.
     *
     * @return void
     */
    public function run()
    {
        // Create roles
        $roles = ['administrator', 'manager', 'user'];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Assign roles to test users
        // Assuming test users exist with emails or other identifiers
        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser) {
            $adminUser->assignRole('administrator');
        }

        $managerUser = User::where('email', 'manager@example.com')->first();
        if ($managerUser) {
            $managerUser->assignRole('manager');
        }

        $normalUser = User::where('email', 'user@example.com')->first();
        if ($normalUser) {
            $normalUser->assignRole('user');
        }
    }
}

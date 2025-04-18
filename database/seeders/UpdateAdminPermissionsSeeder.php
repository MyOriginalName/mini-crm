<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UpdateAdminPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
            $this->command->info('Admin permissions updated successfully.');
        } else {
            $this->command->error('Admin role not found.');
        }
    }
} 
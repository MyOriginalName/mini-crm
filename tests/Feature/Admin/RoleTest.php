<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create the 'admin' role and 'manage roles' permission before assigning them
        $adminRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        Permission::firstOrCreate(['name' => 'manage roles']);

        // Create a user with admin role and permissions for roles
        $this->user = User::factory()->create();
        $this->user->assignRole($adminRole);
        $this->user->givePermissionTo('manage roles');
        $this->actingAs($this->user);
    }

    public function test_index_roles()
    {
        $role = Role::create(['name' => 'test role']);
        $response = $this->get(route('admin.roles.index'));
        $response->assertStatus(200);
        $response->assertSee('test role');
    }

    public function test_show_role()
    {
        $role = Role::create(['name' => 'test role']);
        $response = $this->get(route('admin.roles.show', $role));
        $response->assertStatus(200);
        $response->assertSee('test role');
    }

    public function test_create_role()
    {
        $permission = Permission::create(['name' => 'test permission']);
        $response = $this->post(route('admin.roles.store'), [
            'name' => 'new role',
            'permissions' => [$permission->id],
        ]);
        $response->assertRedirect(route('admin.roles.index'));
        $this->assertDatabaseHas('roles', ['name' => 'new role']);
        $role = Role::where('name', 'new role')->first();
        $this->assertTrue($role->hasPermissionTo('test permission'));
    }

    public function test_update_role()
    {
        $role = Role::create(['name' => 'old name']);
        $permission = Permission::create(['name' => 'test permission']);
        $response = $this->put(route('admin.roles.update', $role), [
            'name' => 'updated name',
            'permissions' => [$permission->id],
        ]);
        $response->assertRedirect(route('admin.roles.index'));
        $this->assertDatabaseHas('roles', ['name' => 'updated name']);
        $role->refresh();
        $this->assertTrue($role->hasPermissionTo('test permission'));
    }

    public function test_delete_role_not_implemented()
    {
        $role = Role::create(['name' => 'to be deleted']);
        $response = $this->delete(route('admin.roles.destroy', $role));
        $response->assertStatus(404);
        $this->assertDatabaseHas('roles', ['name' => 'to be deleted']);
    }

    public function test_validation_errors_on_create()
    {
        $response = $this->post(route('admin.roles.store'), [
            'name' => '', // required field empty
        ]);
        $response->assertSessionHasErrors('name');
    }

    public function test_validation_errors_on_update()
    {
        $role = Role::create(['name' => 'valid name']);
        $response = $this->put(route('admin.roles.update', $role), [
            'name' => '', // required field empty
        ]);
        $response->assertSessionHasErrors('name');
    }
}

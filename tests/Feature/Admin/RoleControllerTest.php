<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $manager;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Создаем разрешения
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create clients']);
        Permission::create(['name' => 'edit clients']);
        Permission::create(['name' => 'view clients']);

        // Создаем роли
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $userRole = Role::create(['name' => 'user']);

        // Назначаем разрешения ролям
        $adminRole->givePermissionTo(Permission::all());
        $managerRole->givePermissionTo(['view users', 'view clients', 'create clients', 'edit clients']);
        $userRole->givePermissionTo(['view clients']);

        // Создаем пользователей
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->manager = User::factory()->create();
        $this->manager->assignRole('manager');

        $this->user = User::factory()->create();
        $this->user->assignRole('user');
    }

    /** @test */
    public function admin_can_view_roles_page()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.roles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/Roles/Index')
            ->has('roles.data', 3)
            ->has('permissions', 5)
        );
    }

    /** @test */
    public function non_admin_cannot_view_roles_page()
    {
        $response = $this->actingAs($this->manager)->get(route('admin.roles.index'));
        $response->assertStatus(403);

        $response = $this->actingAs($this->user)->get(route('admin.roles.index'));
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_role_details()
    {
        $role = Role::where('name', 'manager')->first();
        
        $response = $this->actingAs($this->admin)->get(route('admin.roles.show', $role->id));

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/Roles/Show')
            ->has('role')
            ->has('permissions', 5)
            ->where('role.name', 'manager')
        );
    }

    /** @test */
    public function admin_can_update_role()
    {
        $role = Role::where('name', 'manager')->first();
        $permissions = Permission::whereIn('name', ['view users', 'view clients'])->pluck('id')->toArray();
        
        $response = $this->actingAs($this->admin)->put(route('admin.roles.update', $role->id), [
            'name' => 'supervisor',
            'permissions' => $permissions
        ]);

        $response->assertRedirect(route('admin.roles.index'));
        $response->assertSessionHas('success', 'Роль успешно обновлена.');

        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'supervisor'
        ]);

        $updatedRole = Role::find($role->id);
        $this->assertEquals(2, $updatedRole->permissions->count());
    }

    /** @test */
    public function non_admin_cannot_update_role()
    {
        $role = Role::where('name', 'manager')->first();
        
        $response = $this->actingAs($this->manager)->put(route('admin.roles.update', $role->id), [
            'name' => 'supervisor',
            'permissions' => []
        ]);
        
        $response->assertStatus(403);
        
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'manager'
        ]);
    }

    /** @test */
    public function role_name_must_be_unique()
    {
        $role = Role::where('name', 'manager')->first();
        $permissions = Permission::pluck('id')->toArray();
        
        $response = $this->actingAs($this->admin)->put(route('admin.roles.update', $role->id), [
            'name' => 'admin', // Уже существует
            'permissions' => $permissions
        ]);

        $response->assertSessionHasErrors('name');
        
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'manager'
        ]);
    }
} 
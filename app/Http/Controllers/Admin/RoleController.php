<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        $permissions = Permission::all();
        return Inertia::render('Admin/Roles/Index', ['roles' => $roles, 'permissions' => $permissions]);
    }

    public function show(Role $role)
    {
        $permissions = Permission::all();
        return Inertia::render('Admin/Roles/Show', ['role' => $role, 'permissions' => $permissions]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['integer'],
        ]);

        $role->name = $validated['name'];
        $role->save();

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Роль успешно обновлена.');
    }
}

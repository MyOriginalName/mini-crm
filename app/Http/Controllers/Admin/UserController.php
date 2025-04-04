<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->paginate(10);
        $roles = Role::all();

        return inertia('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->back()->with('success', 'Пользователь успешно обновлен');
    }

    public function show(User $user)
    {
        $user->load('roles');
        return inertia('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::all();
        
        $recentDeals = $user->deals()->latest()->take(3)->get();
        $recentTasks = $user->tasks()->latest()->take(3)->get();
        $recentClients = $user->clients()->latest()->take(3)->get();
        
        return inertia('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'recentDeals' => $recentDeals,
            'recentTasks' => $recentTasks,
            'recentClients' => $recentClients,
        ]);
    }
} 
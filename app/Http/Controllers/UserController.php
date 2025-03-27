<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('permission:manage users');
    }

    public function index()
    {
        $users = User::with('roles')
            ->withCount('tasks')
            ->latest()
            ->paginate(10);

        $roles = Role::all();
        $logs = Log::where('user_id', '!=', null)
            ->with('user')
            ->latest()
            ->take(50)
            ->get();

        return view('users.index', compact('users', 'roles', 'logs'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index')
            ->with('success', 'Пользователь успешно создан.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', Password::defaults()],
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index')
            ->with('success', 'Пользователь успешно обновлен.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Вы не можете удалить свой аккаунт.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Пользователь успешно удален.');
    }

    public function logs(User $user)
    {
        $logs = Log::where('user_id', $user->id)
            ->latest()
            ->paginate(20);

        return view('users.logs', compact('user', 'logs'));
    }
} 
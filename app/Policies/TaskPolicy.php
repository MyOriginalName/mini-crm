<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view tasks', 'view own tasks']);
    }

    public function view(User $user, Task $task): bool
    {
        if ($user->hasPermissionTo('view tasks')) {
            return true;
        }

        return $user->hasPermissionTo('view own tasks') && $task->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['create tasks', 'create own tasks']);
    }

    public function update(User $user, Task $task): bool
    {
        if ($user->hasPermissionTo('edit tasks')) {
            return true;
        }

        return $user->hasPermissionTo('edit own tasks') && $task->user_id === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        if ($user->hasPermissionTo('delete tasks')) {
            return true;
        }

        return $user->hasPermissionTo('edit own tasks') && $task->user_id === $user->id;
    }

    public function updateAny(User $user): bool
    {
        return $user->hasAnyPermission(['edit tasks', 'edit own tasks']);
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasAnyPermission(['delete tasks', 'edit own tasks']);
    }
} 
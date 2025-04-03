<?php

namespace App\Policies;

use App\Models\Deal;
use App\Models\User;

class DealPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view deals', 'view own deals']);
    }

    public function view(User $user, Deal $deal): bool
    {
        if ($user->hasPermissionTo('view deals')) {
            return true;
        }

        return $user->hasPermissionTo('view own deals') && $deal->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['create deals', 'create own deals']);
    }

    public function update(User $user, Deal $deal): bool
    {
        if ($user->hasPermissionTo('edit deals')) {
            return true;
        }

        return $user->hasPermissionTo('edit own deals') && $deal->user_id === $user->id;
    }

    public function delete(User $user, Deal $deal): bool
    {
        if ($user->hasPermissionTo('delete deals')) {
            return true;
        }

        return $user->hasPermissionTo('edit own deals') && $deal->user_id === $user->id;
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasAnyPermission(['delete deals', 'delete own deals']);
    }
} 
<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view clients', 'view own clients']);
    }

    public function view(User $user, Client $client): bool
    {
        if ($user->hasPermissionTo('view clients')) {
            return true;
        }

        return $user->hasPermissionTo('view own clients') && $client->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['create clients', 'create own clients']);
    }

    public function update(User $user, Client $client): bool
    {
        if ($user->hasPermissionTo('edit clients')) {
            return true;
        }

        return $user->hasPermissionTo('edit own clients') && $client->user_id === $user->id;
    }

    public function delete(User $user, Client $client): bool
    {
        if ($user->hasPermissionTo('delete clients')) {
            return true;
        }

        return $user->hasPermissionTo('edit own clients') && $client->user_id === $user->id;
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasAnyPermission(['delete clients', 'delete own clients']);
    }
} 
<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Deal;
use App\Models\Task;
use App\Policies\ClientPolicy;
use App\Policies\DealPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Client::class => ClientPolicy::class,
        Deal::class => DealPolicy::class,
        Task::class => TaskPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
} 
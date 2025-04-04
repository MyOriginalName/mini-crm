<?php

use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\CRM\ClientController;
use App\Http\Controllers\CRM\DealController;
use App\Http\Controllers\CRM\TaskController;
use App\Http\Controllers\User\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Admin routes
    Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\AdminController::class, 'index'])->name('index');
        Route::resource('users', App\Http\Controllers\Admin\UserController::class);
        Route::resource('logs', App\Http\Controllers\Admin\LogController::class);
        Route::resource('settings', App\Http\Controllers\Admin\SystemSettingsController::class);
        Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Клиенты
    Route::middleware([\Spatie\Permission\Middleware\PermissionMiddleware::class.':view clients'])->group(function () {
        Route::resource('clients', ClientController::class);
    });

    // Сделки
    Route::middleware([\Spatie\Permission\Middleware\PermissionMiddleware::class.':view deals'])->group(function () {
        Route::get('/deals/kanban', [DealController::class, 'kanban'])->name('deals.kanban');
        Route::put('/deals/{deal}/status', [DealController::class, 'updateStatus'])->name('deals.update-status');
        Route::resource('deals', DealController::class);
    });

    // Задачи
    Route::middleware([\Spatie\Permission\Middleware\PermissionMiddleware::class.':view tasks'])->group(function () {
        Route::resource('tasks', TaskController::class);
    });

    // Маршруты управления пользователями
    Route::middleware([\Spatie\Permission\Middleware\PermissionMiddleware::class.':manage users'])->group(function () {
        Route::resource('users', UserController::class);
        Route::get('users/{user}/logs', [UserController::class, 'logs'])->name('users.logs');
    });
});

require __DIR__.'/auth.php';

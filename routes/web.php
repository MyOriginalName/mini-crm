<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Клиенты
    Route::resource('clients', ClientController::class);

    // Сделки
    Route::get('/deals/kanban', [DealController::class, 'kanban'])->name('deals.kanban');
    Route::put('/deals/{deal}/status', [DealController::class, 'updateStatus'])->name('deals.update-status');
    Route::resource('deals', DealController::class);

    // Задачи
    Route::resource('tasks', TaskController::class);

    // Маршруты управления пользователями
    Route::middleware('permission:manage users')->group(function () {
        Route::resource('users', UserController::class);
        Route::get('users/{user}/logs', [UserController::class, 'logs'])->name('users.logs');
    });
});

require __DIR__.'/auth.php';

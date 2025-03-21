<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Клиенты
    Route::prefix('clients')->name('clients.')->group(function () {
        // Маршруты для виджета
        Route::prefix('widget')->name('widget.')->group(function () {
            Route::get('/', [ClientController::class, 'widget'])->name('index');
            Route::post('/', [ClientController::class, 'widgetStore'])->name('store');
        });

        Route::get('/', [ClientController::class, 'index'])->name('index');
        Route::get('/create', [ClientController::class, 'create'])->name('create');
        Route::post('/', [ClientController::class, 'store'])->name('store');
        Route::get('/{client}/edit', [ClientController::class, 'edit'])->name('edit');
        Route::get('/{client}', [ClientController::class, 'show'])->name('show');
        Route::put('/{client}', [ClientController::class, 'update'])->name('update');
        Route::delete('/{client}', [ClientController::class, 'destroy'])->name('destroy');
        Route::patch('/{client}/tags', [ClientController::class, 'updateTags'])->name('updateTags');
    });

    // Сделки
    Route::prefix('deals')->name('deals.')->group(function () {
        Route::get('/', [DealController::class, 'index'])->name('index');
        Route::get('/create', [DealController::class, 'create'])->name('create');
        Route::post('/', [DealController::class, 'store'])->name('store');
        Route::get('/kanban', [DealController::class, 'kanban'])->name('kanban');
        Route::get('/{deal}/edit', [DealController::class, 'edit'])->name('edit');
        Route::get('/{deal}', [DealController::class, 'show'])->name('show');
        Route::put('/{deal}', [DealController::class, 'update'])->name('update');
        Route::delete('/{deal}', [DealController::class, 'destroy'])->name('destroy');
        Route::patch('/{deal}/status', [DealController::class, 'updateStatus'])->name('update-status');
    });

    // Теги
    Route::resource('tags', TagController::class);

    Route::resource('tasks', TaskController::class);
});

require __DIR__.'/auth.php';

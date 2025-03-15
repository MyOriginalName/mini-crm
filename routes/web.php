<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\TagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/stocks', [StockController::class, 'index'])->name('stocks.index');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('clients', ClientController::class);
    Route::patch('/clients/{client}/tags', [ClientController::class, 'updateTags'])->name('clients.update-tags');
    
    Route::resource('deals', DealController::class);
    Route::get('/deals/kanban', [DealController::class, 'kanban'])->name('deals.kanban');
    Route::patch('/deals/{deal}/status', [DealController::class, 'updateStatus'])->name('deals.update-status');

    Route::resource('tags', TagController::class);
});

require __DIR__.'/auth.php';

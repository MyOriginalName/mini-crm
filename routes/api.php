<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\TinkoffController;
use App\Http\Controllers\Api\DealController;

Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'log.actions'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        
        // Клиенты
        Route::get('clients/export', [ClientController::class, 'clients_export']);
        Route::get('clients/widget', [ClientController::class, 'widget']);
        Route::post('clients/widget', [ClientController::class, 'widgetStore']);
        Route::put('clients/{client}/tags', [ClientController::class, 'updateTags']);
        Route::apiResource('clients', ClientController::class);
        
        // Задачи
        Route::apiResource('tasks', TaskController::class);

        // Сделки
        Route::get('deals', [DealController::class, 'index']);
        Route::post('deals', [DealController::class, 'store']);
        Route::get('deals/{deal}', [DealController::class, 'show']);
        Route::put('deals/{deal}', [DealController::class, 'update']);
        Route::patch('deals/{deal}', [DealController::class, 'update']);
        Route::delete('deals/{deal}', [DealController::class, 'destroy']);
        Route::put('deals/{deal}/status', [DealController::class, 'updateStatus']);
    });
});

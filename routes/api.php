<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ClientController; // Добавляем импорт

Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);

        // Добавляем маршруты для клиентов
        Route::apiResource('clients', ClientController::class);
        
        // Маршруты для задач
        Route::apiResource('tasks', TaskController::class);
    });
});

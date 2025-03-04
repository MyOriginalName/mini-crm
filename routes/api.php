<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TinkoffController;

Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::get('clients/export/', [ClientController::class, 'clients_export']);

        // Добавляем логирование на удаление клиентов и задач
        Route::apiResource('clients', ClientController::class)->middleware('log.actions');
        Route::apiResource('tasks', TaskController::class)->middleware('log.actions');
    });
});

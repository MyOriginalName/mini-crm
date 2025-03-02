<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Сохраняем ID даже после удаления пользователя
            $table->string('action'); // Действие (удаление клиента, обновление задачи и т.д.)
            $table->string('entity_type'); // Тип сущности (client, task)
            $table->unsignedBigInteger('entity_id'); // ID сущности
            $table->json('data')->nullable(); // Дополнительные данные (например, какие поля изменились)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};

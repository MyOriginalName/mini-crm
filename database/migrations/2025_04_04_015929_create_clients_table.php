<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->enum('type', ['individual', 'company']);
            $table->enum('status', ['active', 'inactive', 'blocked']);
            $table->string('company_name')->nullable();
            $table->string('inn', 10)->nullable();
            $table->string('kpp', 9)->nullable();
            $table->text('address');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->softDeletes(); // Добавляем столбец для мягкого удаления
            
            // Добавляем внешний ключ
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
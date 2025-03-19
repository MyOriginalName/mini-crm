<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Сначала изменяем тип колонки на string, чтобы можно было добавить новое значение
        DB::statement("ALTER TABLE deals MODIFY COLUMN status VARCHAR(255)");
        
        // Обновляем существующие записи
        DB::table('deals')->where('status', 'new')->update(['status' => 'suspended']);
        
        // Возвращаем тип колонки обратно на enum с новым значением
        DB::statement("ALTER TABLE deals MODIFY COLUMN status ENUM('suspended', 'in_progress', 'won', 'lost')");
    }

    public function down(): void
    {
        // Сначала изменяем тип колонки на string
        DB::statement("ALTER TABLE deals MODIFY COLUMN status VARCHAR(255)");
        
        // Обновляем записи со статусом suspended обратно на new
        DB::table('deals')->where('status', 'suspended')->update(['status' => 'new']);
        
        // Возвращаем тип колонки обратно на enum без значения suspended
        DB::statement("ALTER TABLE deals MODIFY COLUMN status ENUM('new', 'in_progress', 'won', 'lost')");
    }
}; 
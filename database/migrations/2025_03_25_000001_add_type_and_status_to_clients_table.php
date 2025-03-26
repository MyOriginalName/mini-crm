<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('type')->default('individual')->after('phone');
            $table->string('status')->default('active')->after('type');
            $table->string('company_name')->nullable()->after('status');
            $table->string('inn')->nullable()->after('company_name');
            $table->string('kpp')->nullable()->after('inn');
            $table->string('address')->nullable()->after('kpp');
            $table->text('description')->nullable()->after('address');
            
            // Переименовываем существующие поля
            $table->renameColumn('company', 'old_company');
            $table->renameColumn('notes', 'old_notes');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'status',
                'company_name',
                'inn',
                'kpp',
                'address',
                'description'
            ]);
            
            // Возвращаем старые имена полей
            $table->renameColumn('old_company', 'company');
            $table->renameColumn('old_notes', 'notes');
        });
    }
}; 
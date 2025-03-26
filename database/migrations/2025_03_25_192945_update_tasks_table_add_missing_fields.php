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
        if (!Schema::hasTable('tasks')) {
            Schema::create('tasks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('client_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('deal_id')->nullable()->constrained()->onDelete('set null');
                $table->string('title');
                $table->text('description')->nullable();
                $table->timestamp('due_date')->nullable();
                $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
                $table->timestamps();
            });
        } else {
            Schema::table('tasks', function (Blueprint $table) {
                if (!Schema::hasColumn('tasks', 'priority')) {
                    $table->enum('priority', ['low', 'medium', 'high'])->default('medium')->after('status');
                }
                if (!Schema::hasColumn('tasks', 'deal_id')) {
                    $table->foreignId('deal_id')->nullable()->after('client_id')->constrained()->onDelete('set null');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (Schema::hasColumn('tasks', 'deal_id')) {
                $table->dropForeign(['deal_id']);
                $table->dropColumn('deal_id');
            }
            if (Schema::hasColumn('tasks', 'priority')) {
                $table->dropColumn('priority');
            }
        });
    }
};

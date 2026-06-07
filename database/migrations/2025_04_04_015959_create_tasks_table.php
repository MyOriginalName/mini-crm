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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['pending', 'in_progress', 'completed']);
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->timestamp('due_date');
<<<<<<< HEAD
            $table->foreignId('deal_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('set null');
=======
            $table->foreignId('deal_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
>>>>>>> 05281e3be73d6ef9066b7d8269d689622d12a2be
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

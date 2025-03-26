<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Удаляем связи с тегами, которые не входят в список разрешенных
        DB::table('client_tag')
            ->whereIn('tag_id', function($query) {
                $query->select('id')
                    ->from('tags')
                    ->whereNotIn('name', ['VIP', 'New', 'Potential', 'Active', 'Inactive']);
            })
            ->delete();

        // Удаляем неиспользуемые теги
        DB::table('tags')
            ->whereNotIn('name', ['VIP', 'New', 'Potential', 'Active', 'Inactive'])
            ->delete();
    }

    public function down(): void
    {
        // Откат не требуется, так как данные уже удалены
    }
}; 
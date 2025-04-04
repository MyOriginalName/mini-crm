<?php

namespace App\Traits;

use App\Models\Log;

trait Loggable
{
    protected static function bootLoggable()
    {
        static::created(function ($model) {
            self::logAction('created', $model);
        });

        static::updated(function ($model) {
            self::logAction('updated', $model);
        });

        static::deleted(function ($model) {
            self::logAction('deleted', $model);
        });
    }

    protected static function logAction($action, $model)
    {
        if (!auth()->check()) {
            return;
        }

        $description = self::generateLogDescription($action, $model);
        
        Log::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => class_basename($model),
            'entity_id' => $model->id,
            'old_values' => $action === 'updated' ? $model->getOriginal() : null,
            'new_values' => $action === 'deleted' ? null : $model->getAttributes(),
            'description' => $description,
        ]);
    }

    protected static function generateLogDescription($action, $model)
    {
        $userName = auth()->user()->name;
        $modelName = class_basename($model);
        
        switch ($action) {
            case 'created':
                return "{$userName} создал(а) {$modelName}";
            case 'updated':
                return "{$userName} обновил(а) {$modelName}";
            case 'deleted':
                return "{$userName} удалил(а) {$modelName}";
            default:
                return "{$userName} выполнил(а) действие {$action} с {$modelName}";
        }
    }
} 
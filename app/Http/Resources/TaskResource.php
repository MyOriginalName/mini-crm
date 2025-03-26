<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Класс для трансформации данных задачи
 * Используется для API и веб-интерфейса
 */
class TaskResource extends JsonResource
{
    /**
     * Преобразует ресурс в массив
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'priority' => $this->priority,
            'priority_label' => $this->getPriorityLabel(),
            'due_date' => $this->due_date,
            'due_date_formatted' => $this->due_date ? $this->due_date->format('d.m.Y') : null,
            'is_overdue' => $this->isOverdue(),
            'user' => $this->when($this->user, function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),
            'client' => $this->when($this->client, function () {
                return [
                    'id' => $this->client->id,
                    'name' => $this->client->name,
                ];
            }),
            'deal' => $this->when($this->deal, function () {
                return [
                    'id' => $this->deal->id,
                    'name' => $this->deal->name,
                ];
            }),
            'created_at' => $this->created_at,
            'created_at_formatted' => $this->created_at->format('d.m.Y H:i'),
            'updated_at' => $this->updated_at,
            'updated_at_formatted' => $this->updated_at->format('d.m.Y H:i'),
        ];
    }

    /**
     * Возвращает метку статуса на русском языке
     */
    private function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Ожидает',
            'in_progress' => 'В работе',
            'completed' => 'Завершена',
            default => 'Неизвестно',
        };
    }

    /**
     * Возвращает метку приоритета на русском языке
     */
    private function getPriorityLabel(): string
    {
        return match($this->priority) {
            'low' => 'Низкий',
            'medium' => 'Средний',
            'high' => 'Высокий',
            default => 'Неизвестно',
        };
    }

    /**
     * Проверяет, просрочена ли задача
     */
    private function isOverdue(): bool
    {
        if (!$this->due_date) {
            return false;
        }

        return $this->status !== 'completed' && $this->due_date->isPast();
    }
} 
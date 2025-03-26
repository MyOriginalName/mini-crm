<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Базовый класс для валидации задач
 * Содержит общие правила валидации, которые используются в StoreRequest и UpdateRequest
 */
abstract class BaseTaskRequest extends FormRequest
{
    /**
     * Определяет, авторизован ли пользователь для выполнения запроса
     */
    public function authorize(): bool
    {
        return true; // В данном случае разрешаем всем авторизованным пользователям
    }

    /**
     * Возвращает общие правила валидации для задач
     */
    protected function getCommonRules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                'in:pending,in_progress,completed',
            ],
            'priority' => [
                'required',
                'in:low,medium,high',
            ],
            'due_date' => [
                'required',
                'date',
            ],
            'user_id' => [
                'required',
                'exists:users,id',
            ],
            'client_id' => [
                'nullable',
                'exists:clients,id',
            ],
            'deal_id' => [
                'nullable',
                'exists:deals,id',
            ],
        ];
    }

    /**
     * Возвращает сообщения об ошибках на русском языке
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Название задачи обязательно для заполнения',
            'title.max' => 'Название задачи не должно превышать 255 символов',
            'status.required' => 'Статус задачи обязателен для заполнения',
            'status.in' => 'Выбран недопустимый статус задачи',
            'priority.required' => 'Приоритет задачи обязателен для заполнения',
            'priority.in' => 'Выбран недопустимый приоритет задачи',
            'due_date.required' => 'Срок выполнения обязателен для заполнения',
            'due_date.date' => 'Указан недопустимый формат даты',
            'user_id.required' => 'Исполнитель обязателен для заполнения',
            'user_id.exists' => 'Выбран несуществующий исполнитель',
            'client_id.exists' => 'Выбран несуществующий клиент',
            'deal_id.exists' => 'Выбрана несуществующая сделка',
        ];
    }
} 
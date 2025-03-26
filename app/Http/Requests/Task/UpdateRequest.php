<?php

namespace App\Http\Requests\Task;

/**
 * Класс для валидации обновления существующей задачи
 * Наследует общие правила валидации из BaseTaskRequest
 */
class UpdateRequest extends BaseTaskRequest
{
    /**
     * Возвращает правила валидации для обновления задачи
     * В данном случае используем общие правила из базового класса
     * В будущем здесь можно добавить специфичные правила для обновления
     */
    public function rules(): array
    {
        return $this->getCommonRules();
    }
} 
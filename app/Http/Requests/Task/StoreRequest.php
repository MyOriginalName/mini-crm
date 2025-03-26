<?php

namespace App\Http\Requests\Task;

/**
 * Класс для валидации создания новой задачи
 * Наследует общие правила валидации из BaseTaskRequest
 */
class StoreRequest extends BaseTaskRequest
{
    /**
     * Возвращает правила валидации для создания задачи
     * В данном случае используем общие правила из базового класса
     */
    public function rules(): array
    {
        return $this->getCommonRules();
    }
} 
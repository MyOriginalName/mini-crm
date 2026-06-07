<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

abstract class BaseTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

<<<<<<< HEAD
    protected function prepareForValidation()
    {
        $this->merge([
            'client_id' => $this->client_id ? (int) $this->client_id : null,
            'deal_id' => $this->deal_id ? (int) $this->deal_id : null,
        ]);
    }

=======
>>>>>>> 05281e3be73d6ef9066b7d8269d689622d12a2be
    protected function getCommonRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['required', 'date'],
<<<<<<< HEAD
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'deal_id' => ['nullable', 'integer', 'exists:deals,id'],
=======
            'client_id' => ['nullable', 'exists:clients,id'],
            'deal_id' => ['nullable', 'exists:deals,id'],
>>>>>>> 05281e3be73d6ef9066b7d8269d689622d12a2be
        ];
    }

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
            'client_id.exists' => 'Выбран несуществующий клиент',
            'deal_id.exists' => 'Выбрана несуществующая сделка',
        ];
    }
}

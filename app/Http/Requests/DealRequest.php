<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'client_id' => 'required|integer|exists:clients,id',
            'value' => 'required|numeric|min:0',
            'status' => 'required|string|in:suspended,in_progress,won,lost',
            'description' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Название сделки обязательно для заполнения',
            'client_id.required' => 'Клиент обязателен для выбора',
            'client_id.exists' => 'Выбранный клиент не существует',
            'value.required' => 'Сумма сделки обязательна для заполнения',
            'value.numeric' => 'Сумма сделки должна быть числом',
            'value.min' => 'Сумма сделки не может быть отрицательной',
            'status.required' => 'Статус сделки обязателен для выбора',
            'status.in' => 'Недопустимый статус сделки'
        ];
    }
} 
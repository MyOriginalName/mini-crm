import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/constants/taskConstants';

export default function TaskForm({ isEditing = false, task = null, clients = [], deals = [], users = [] }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    client_id: "",
    deal_id: "",
    user_id: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
        client_id: task.client_id || "",
        deal_id: task.deal_id || "",
        user_id: task.user_id || ""
      });
    }
  }, [isEditing, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    if (isEditing) {
      router.put(route('tasks.update', task.id), formData, {
        onSuccess: () => {
          router.visit(route('tasks.index'));
        },
        onError: (errors) => {
          setFieldErrors(errors);
          setSubmitting(false);
        }
      });
    } else {
      router.post(route('tasks.store'), formData, {
        onSuccess: () => {
          router.visit(route('tasks.index'));
        },
        onError: (errors) => {
          setFieldErrors(errors);
          setSubmitting(false);
        }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Название
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.title ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название задачи"
            required
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Описание
          </label>
          <textarea
            className={`shadow appearance-none border ${
              fieldErrors.description ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание задачи"
            rows="4"
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.description[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Статус
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.status ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {fieldErrors.status && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.status[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Приоритет
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.priority ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {fieldErrors.priority && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.priority[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
            Срок выполнения
          </label>
          <input
            type="date"
            className={`shadow appearance-none border ${
              fieldErrors.due_date ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
          {fieldErrors.due_date && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.due_date[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
            Исполнитель
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.user_id ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите исполнителя</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          {fieldErrors.user_id && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.user_id[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client_id">
            Клиент
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.client_id ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="client_id"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите клиента</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {fieldErrors.client_id && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.client_id[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deal_id">
            Сделка
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.deal_id ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="deal_id"
            name="deal_id"
            value={formData.deal_id}
            onChange={handleChange}
          >
            <option value="">Выберите сделку</option>
            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>{deal.name}</option>
            ))}
          </select>
          {fieldErrors.deal_id && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.deal_id[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Сохранение..." : isEditing ? "Обновить задачу" : "Создать задачу"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.visit(route('tasks.index'))}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
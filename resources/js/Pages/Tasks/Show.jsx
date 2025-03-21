import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select } from '@/Components/ui/select';
import { Label } from "@/Components/ui/label";
import { router } from '@inertiajs/react';

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Отменено',
};

const priorityLabels = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function Show({ auth, task, clients, deals, users }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleUpdate = (e) => {
    e.preventDefault();
    router.put(route('tasks.update', task.id), editedTask, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      router.delete(route('tasks.destroy', task.id));
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Задача: ${task.title}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{task.title}</h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Отмена' : 'Редактировать'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Удалить
              </Button>
              <Button
                onClick={() => window.location.href = route('tasks.index')}
              >
                К списку
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Основная информация</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Статус</dt>
                    <dd>
                      {isEditing ? (
                        <Select
                          value={editedTask.status}
                          onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Приоритет</dt>
                    <dd>
                      {isEditing ? (
                        <Select
                          value={editedTask.priority}
                          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                        >
                          {Object.entries(priorityLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Срок выполнения</dt>
                    <dd>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedTask.deadline}
                          onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        new Date(task.deadline).toLocaleDateString('ru-RU')
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Исполнитель и связи</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Исполнитель</dt>
                    <dd>
                      {isEditing ? (
                        <Select
                          value={editedTask.user_id}
                          onChange={(e) => setEditedTask({ ...editedTask, user_id: e.target.value })}
                        >
                          <option value="">Выберите исполнителя</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </Select>
                      ) : (
                        task.user.name
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Клиент</dt>
                    <dd>
                      {isEditing ? (
                        <Select
                          value={editedTask.client_id}
                          onChange={(e) => setEditedTask({ ...editedTask, client_id: e.target.value })}
                        >
                          <option value="">Выберите клиента</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </Select>
                      ) : (
                        task.client ? (
                          <a
                            href={route('clients.show', task.client.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {task.client.name}
                          </a>
                        ) : 'Не указан'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Сделка</dt>
                    <dd>
                      {isEditing ? (
                        <Select
                          value={editedTask.deal_id}
                          onChange={(e) => setEditedTask({ ...editedTask, deal_id: e.target.value })}
                        >
                          <option value="">Выберите сделку</option>
                          {deals.map((deal) => (
                            <option key={deal.id} value={deal.id}>{deal.name}</option>
                          ))}
                        </Select>
                      ) : (
                        task.deal ? (
                          <a
                            href={route('deals.show', task.deal.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {task.deal.name}
                          </a>
                        ) : 'Не указана'
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Описание</h3>
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название</Label>
                      <input
                        id="title"
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <textarea
                        id="description"
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows="4"
                      />
                    </div>
                    <Button type="submit">Сохранить</Button>
                  </form>
                ) : (
                  <div className="prose max-w-none">
                    {task.description || 'Описание отсутствует'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
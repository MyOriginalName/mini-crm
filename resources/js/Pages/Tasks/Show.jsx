import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select } from '@/Components/ui/select';
import { Label } from "@/Components/ui/label";
import { router } from '@inertiajs/react';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@/constants/taskConstants';
import PropTypes from 'prop-types';

// Подкомпонент для отображения статуса
const StatusDisplay = ({ status, isEditing, value, onChange }) => (
  <div>
    <dt className="text-sm text-gray-500">Статус</dt>
    <dd>
      {isEditing ? (
        <Select
          value={value}
          onChange={onChange}
        >
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      ) : (
        <span className={`px-2 py-1 rounded-full text-sm ${TASK_STATUS_COLORS[status]}`}>
          {TASK_STATUS_LABELS[status]}
        </span>
      )}
    </dd>
  </div>
);

// Подкомпонент для отображения приоритета
const PriorityDisplay = ({ priority, isEditing, value, onChange }) => (
  <div>
    <dt className="text-sm text-gray-500">Приоритет</dt>
    <dd>
      {isEditing ? (
        <Select
          value={value}
          onChange={onChange}
        >
          {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      ) : (
        <span className={`px-2 py-1 rounded-full text-sm ${TASK_PRIORITY_COLORS[priority]}`}>
          {TASK_PRIORITY_LABELS[priority]}
        </span>
      )}
    </dd>
  </div>
);

// Подкомпонент для отображения даты
const DateDisplay = ({ dueDate, isEditing, value, onChange }) => (
  <div>
    <dt className="text-sm text-gray-500">Срок выполнения</dt>
    <dd>
      {isEditing ? (
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      ) : (
        dueDate ? new Date(dueDate).toLocaleDateString('ru-RU') : 'Не указан'
      )}
    </dd>
  </div>
);

// Подкомпонент для отображения связей
const RelationsDisplay = ({ task, isEditing, editedTask, setEditedTask, users, clients, deals }) => (
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
              task.user?.name || 'Не указан'
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
);

// Подкомпонент для отображения описания
const DescriptionDisplay = ({ task, isEditing, editedTask, setEditedTask }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Описание</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название</Label>
          {isEditing ? (
            <input
              id="title"
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          ) : (
            <div>{task.title}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          {isEditing ? (
            <textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="4"
            />
          ) : (
            <div className="whitespace-pre-wrap">{task.description || 'Нет описания'}</div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Show({ auth, task, clients, deals, users }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    ...task,
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Отправка данных:', editedTask);
    
    if (!editedTask.due_date) {
      console.error('Дата выполнения не указана');
      return;
    }

    router.put(route('tasks.update', task.id), editedTask, {
      onSuccess: () => {
        console.log('Задача успешно обновлена');
        setIsEditing(false);
        router.visit(route('tasks.index'));
      },
      onError: (errors) => {
        console.error('Ошибки валидации:', errors);
      },
      preserveScroll: true,
    });
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      router.delete(route('tasks.destroy', task.id), {
        onSuccess: () => {
          router.visit(route('tasks.index'));
        },
        onError: (errors) => {
          console.error('Ошибка при удалении:', errors);
        }
      });
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
                onClick={() => router.visit(route('tasks.index'))}
              >
                К списку
              </Button>
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Основная информация</h3>
                  <dl className="space-y-4">
                    <StatusDisplay
                      status={task.status}
                      isEditing={isEditing}
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                    />
                    <PriorityDisplay
                      priority={task.priority}
                      isEditing={isEditing}
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                    />
                    <DateDisplay
                      dueDate={task.due_date}
                      isEditing={isEditing}
                      value={editedTask.due_date}
                      onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                    />
                  </dl>
                </CardContent>
              </Card>

              <RelationsDisplay
                task={task}
                isEditing={isEditing}
                editedTask={editedTask}
                setEditedTask={setEditedTask}
                users={users}
                clients={clients}
                deals={deals}
              />

              <DescriptionDisplay
                task={task}
                isEditing={isEditing}
                editedTask={editedTask}
                setEditedTask={setEditedTask}
              />
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button type="submit">Сохранить</Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// PropTypes
Show.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired
  }).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    due_date: PropTypes.string,
    user: PropTypes.object,
    client: PropTypes.object,
    deal: PropTypes.object
  }).isRequired,
  clients: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  deals: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

StatusDisplay.propTypes = {
  status: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

PriorityDisplay.propTypes = {
  priority: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

DateDisplay.propTypes = {
  dueDate: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

RelationsDisplay.propTypes = {
  task: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editedTask: PropTypes.object.isRequired,
  setEditedTask: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  clients: PropTypes.array.isRequired,
  deals: PropTypes.array.isRequired
};

DescriptionDisplay.propTypes = {
  task: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editedTask: PropTypes.object.isRequired,
  setEditedTask: PropTypes.func.isRequired
}; 
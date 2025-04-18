import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from 'Layouts/AuthenticatedLayout';
import TaskList from 'Components/Tasks/TaskList';
import { Button } from 'Components/ui/button';
import { Input } from 'Components/ui/input';
import { router } from '@inertiajs/react';


export default function Index({ auth, tasks, filters, clients, deals, users }) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [priority, setPriority] = useState(filters.priority || '');
  const [clientId, setClientId] = useState(filters.client_id || '');
  const [dealId, setDealId] = useState(filters.deal_id || '');
  const [userId, setUserId] = useState(filters.user_id || '');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('tasks.index'), {
      search,
      status,
      priority,
      client_id: clientId,
      deal_id: dealId,
      user_id: userId,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Задачи</h2>}
    >
      <Head title="Задачи" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Список задач</h3>
                <Button onClick={() => router.get(route('tasks.create'))}>
                  Создать задачу
                </Button>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="text"
                    placeholder="Поиск..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Все статусы</option>
                    <option value="pending">В ожидании</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершено</option>
                  </select>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="">Все приоритеты</option>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  >
                    <option value="">Все клиенты</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                  >
                    <option value="">Все сделки</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    <option value="">Все исполнители</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Применить фильтры</Button>
                </div>
              </form>

              <TaskList tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
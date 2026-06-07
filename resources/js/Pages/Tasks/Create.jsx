import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';

const statusOptions = [
  { value: 'pending', label: 'В ожидании' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершена' },
];

const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export default function Create({ auth, clients, deals, users }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    client_id: '',
    deal_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('tasks.store'));
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Создать задачу" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Создать задачу</h2>
            <Button
              variant="outline"
              onClick={() => window.location.href = route('tasks.index')}
            >
              К списку
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Название задачи</Label>
                  <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="4"
                  />
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      id="status"
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className="mt-1"
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                  </div>

                  <div>
                    <Label htmlFor="priority">Приоритет</Label>
                    <Select
                      id="priority"
                      value={data.priority}
                      onChange={e => setData('priority', e.target.value)}
                      className="mt-1"
                      required
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.priority && <div className="text-red-500 text-sm mt-1">{errors.priority}</div>}
                  </div>

                  <div>
                    <Label htmlFor="due_date">Срок выполнения</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={data.due_date}
                      onChange={e => setData('due_date', e.target.value)}
                      className="mt-1"
                      required
                    />
                    {errors.due_date && <div className="text-red-500 text-sm mt-1">{errors.due_date}</div>}
                  </div>

                  <div>
                    <Label htmlFor="client_id">Клиент</Label>
                    <Select
                      id="client_id"
                      value={data.client_id}
                      onChange={e => setData('client_id', e.target.value)}
                      className="mt-1"
                    >
                      <option value="">Без клиента</option>
                      {clients?.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </Select>
                    {errors.client_id && <div className="text-red-500 text-sm mt-1">{errors.client_id}</div>}
                  </div>

                  <div>
                    <Label htmlFor="deal_id">Сделка</Label>
                    <Select
                      id="deal_id"
                      value={data.deal_id}
                      onChange={e => setData('deal_id', e.target.value)}
                      className="mt-1"
                    >
                      <option value="">Без сделки</option>
                      {deals?.map(deal => (
                        <option key={deal.id} value={deal.id}>
                          {deal.name}
                        </option>
                      ))}
                    </Select>
                    {errors.deal_id && <div className="text-red-500 text-sm mt-1">{errors.deal_id}</div>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={processing}>
                    Создать задачу
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

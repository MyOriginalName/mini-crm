import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';

const statusOptions = [
  { value: 'suspended', label: 'Приостановлена' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'won', label: 'Выиграна' },
  { value: 'lost', label: 'Проиграна' },
];

export default function Create({ auth, clients }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    client_id: '',
    value: '',
    status: 'suspended',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('deals.store'));
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Создать сделку" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Создать сделку</h2>
            <Button
              variant="outline"
              onClick={() => window.location.href = route('deals.index')}
            >
              К списку
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Название сделки</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                  <Label htmlFor="client_id">Клиент</Label>
                  <Select
                    id="client_id"
                    value={data.client_id}
                    onChange={e => setData('client_id', e.target.value)}
                    className="mt-1"
                    required
                  >
                    <option value="">Выберите клиента</option>
                    {clients?.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                  {errors.client_id && <div className="text-red-500 text-sm mt-1">{errors.client_id}</div>}
                </div>

                <div>
                  <Label htmlFor="value">Сумма</Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.value}
                    onChange={e => setData('value', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.value && <div className="text-red-500 text-sm mt-1">{errors.value}</div>}
                </div>

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

                <div className="flex justify-end">
                  <Button type="submit" disabled={processing}>
                    Создать сделку
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
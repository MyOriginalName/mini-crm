import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

const statusLabels = {
  suspended: 'Приостановлена',
  in_progress: 'В работе',
  won: 'Выиграна',
  lost: 'Проиграна',
};

const statusColors = {
  suspended: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

export default function Show({ auth, deal }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Сделка: ${deal.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{deal.name}</h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = route('deals.edit', deal.id)}
              >
                Редактировать
              </Button>
              <Button
                onClick={() => window.location.href = route('deals.index')}
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
                      <span className={`px-2 py-1 rounded-full text-sm ${statusColors[deal.status]}`}>
                        {statusLabels[deal.status]}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Сумма</dt>
                    <dd className="font-medium">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }).format(deal.value)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Дата создания</dt>
                    <dd>
                      {new Date(deal.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Клиент</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Имя</dt>
                    <dd className="font-medium">
                      <a
                        href={route('clients.show', deal.client.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {deal.client.name}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${deal.client.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {deal.client.email}
                      </a>
                    </dd>
                  </div>
                  {deal.client.phone && (
                    <div>
                      <dt className="text-sm text-gray-500">Телефон</dt>
                      <dd>
                        <a
                          href={`tel:${deal.client.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {deal.client.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {deal.client.company && (
                    <div>
                      <dt className="text-sm text-gray-500">Компания</dt>
                      <dd>{deal.client.company}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {deal.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Описание</h3>
                  <div className="prose max-w-none">
                    {deal.description}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
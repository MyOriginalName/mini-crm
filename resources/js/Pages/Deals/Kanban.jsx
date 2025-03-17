import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import axios from 'axios';

const statusLabels = {
  new: 'Новые',
  in_progress: 'В работе',
  won: 'Выигранные',
  lost: 'Проигранные',
};

const statusOrder = ['new', 'in_progress', 'won', 'lost'];

const statusColors = {
  new: 'bg-blue-50',
  in_progress: 'bg-yellow-50',
  won: 'bg-green-50',
  lost: 'bg-red-50',
};

export default function Kanban({ auth, deals }) {
  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('dealId', deal.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    
    try {
      const response = await axios.patch(route('deals.update-status', dealId), {
        status: newStatus,
      });
      
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Канбан сделок" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Канбан сделок</h2>
            <Button
              onClick={() => window.location.href = route('deals.index')}
            >
              Список
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusOrder.map((status) => (
              <div
                key={status}
                className={`${statusColors[status]} p-4 rounded-lg`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <h3 className="font-semibold mb-4">{statusLabels[status]}</h3>
                <div className="space-y-4">
                  {deals[status]?.map((deal) => (
                    <Card
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="cursor-move"
                      onClick={() => window.location.href = route('deals.show', deal.id)}
                    >
                      <CardContent className="p-4">
                        <div className="font-medium">{deal.name}</div>
                        <div className="text-sm text-gray-500">{deal.client.name}</div>
                        <div className="text-sm font-medium mt-2">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB'
                          }).format(deal.value)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
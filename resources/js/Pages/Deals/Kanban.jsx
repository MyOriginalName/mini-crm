import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DealCard from '@/Components/DealCard';
import { updateDealsState } from '@/utils/dealUtils';
import axios from 'axios';

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

export default function Kanban({ auth, deals, can }) {
  const [dealsState, setDealsState] = useState(deals);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.status === status) return;

    try {
      const response = await axios.put(route('deals.update-status', draggedDeal.id), {
        status: status
      });

      if (response.data.success) {
        setDealsState(response.data.deals);
      } else {
        console.error('Ошибка при обновлении статуса:', response.data.message);
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Канбан-доска сделок" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = route('deals.index')}
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-semibold">Канбан-доска сделок</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(statusLabels).map(([status, label]) => (
              <Card key={status}>
                <CardContent className="p-4">
                  <div className={`inline-block px-2 py-1 rounded-full text-sm mb-4 ${statusColors[status]}`}>
                    {label}
                  </div>
                  <div
                    className="space-y-4 min-h-[200px]"
                    onDrop={(e) => handleDrop(e, status)}
                    onDragOver={handleDragOver}
                  >
                    {dealsState[status]?.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        isDragging={draggedDeal?.id === deal.id}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onClick={() => window.location.href = route('deals.show', deal.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
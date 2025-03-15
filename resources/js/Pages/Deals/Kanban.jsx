import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import axios from 'axios';

const statusColumns = {
    new: { title: 'Новые', color: 'bg-blue-100' },
    in_progress: { title: 'В работе', color: 'bg-yellow-100' },
    won: { title: 'Успешные', color: 'bg-green-100' },
    lost: { title: 'Провальные', color: 'bg-red-100' },
};

export default function Kanban({ deals: initialDeals }) {
    const [deals, setDeals] = useState(initialDeals);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        const dealId = draggableId;

        try {
            // Оптимистичное обновление UI
            const updatedDeals = { ...deals };
            const deal = updatedDeals[source.droppableId].find(d => d.id === parseInt(dealId));
            
            updatedDeals[source.droppableId] = updatedDeals[source.droppableId].filter(d => d.id !== parseInt(dealId));
            if (!updatedDeals[newStatus]) {
                updatedDeals[newStatus] = [];
            }
            deal.status = newStatus;
            updatedDeals[newStatus].push(deal);
            
            setDeals(updatedDeals);

            // Отправка запроса на сервер
            await axios.patch(`/deals/${dealId}/status`, {
                status: newStatus,
            });
        } catch (error) {
            console.error('Error updating deal status:', error);
            // Можно добавить откат изменений и показать сообщение об ошибке
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Воронка продаж</h2>}
        >
            <Head title="Воронка продаж" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(statusColumns).map(([status, { title, color }]) => (
                                <div key={status} className={`${color} rounded-lg p-4`}>
                                    <h3 className="font-semibold text-lg mb-4">{title}</h3>
                                    <Droppable droppableId={status}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="space-y-4"
                                            >
                                                {(deals[status] || []).map((deal, index) => (
                                                    <Draggable
                                                        key={deal.id}
                                                        draggableId={deal.id.toString()}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white p-4"
                                                            >
                                                                <div className="font-medium">{deal.name}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {deal.client.name}
                                                                </div>
                                                                <div className="mt-2 text-sm font-medium">
                                                                    {new Intl.NumberFormat('ru-RU', {
                                                                        style: 'currency',
                                                                        currency: 'RUB'
                                                                    }).format(deal.value)}
                                                                </div>
                                                                <div className="mt-2 flex justify-end">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => router.get(route('deals.show', deal.id))}
                                                                    >
                                                                        Подробнее
                                                                    </Button>
                                                                </div>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
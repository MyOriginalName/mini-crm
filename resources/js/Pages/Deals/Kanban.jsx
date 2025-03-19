import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import KanbanColumn from '@/Components/KanbanColumn';
import { STATUS_ORDER } from '@/constants/dealStatuses';
import { updateDealsState } from '@/utils/dealUtils';
import axios from 'axios';

export default function Kanban({ auth, deals: initialDeals }) {
    const [deals, setDeals] = useState(initialDeals);
    const [draggedDeal, setDraggedDeal] = useState(null);

    const handleDragStart = (e, deal) => {
        e.dataTransfer.setData('dealId', deal.id);
        setDraggedDeal(deal);
    };

    const handleDragEnd = () => {
        setDraggedDeal(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-opacity-50');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-opacity-50');
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-opacity-50');
        
        const dealId = e.dataTransfer.getData('dealId');
        
        // Оптимистичное обновление UI
        setDeals(updateDealsState(deals, dealId, newStatus));

        try {
            const response = await axios.patch(route('deals.update-status', dealId), {
                status: newStatus,
            });
            
            if (response.data.success && response.data.deals) {
                setDeals(response.data.deals);
            } else {
                setDeals(initialDeals);
                alert('Произошла ошибка при обновлении статуса сделки');
            }
        } catch (error) {
            setDeals(initialDeals);
            alert('Произошла ошибка при обновлении статуса сделки');
        } finally {
            setDraggedDeal(null);
        }
    };

    const handleDealClick = (dealId) => {
        window.location.href = route('deals.show', dealId);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Канбан сделок" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Канбан сделок</h2>
                        <Button onClick={() => window.location.href = route('deals.index')}>
                            Список
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {STATUS_ORDER.map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                deals={deals}
                                draggedDeal={draggedDeal}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onDealClick={handleDealClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
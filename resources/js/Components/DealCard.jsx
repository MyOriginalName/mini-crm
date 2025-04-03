import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { formatCurrency } from '@/utils/dealUtils';
import { Button } from '@/Components/ui/button';
import { Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function DealCard({ deal, isDragging, onDragStart, onDragEnd, onClick, can }) {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (!can?.delete) return;
        
        if (window.confirm('Вы уверены, что хотите удалить эту сделку? Это действие нельзя отменить.')) {
            router.delete(route('deals.destroy', deal.id), {
                onSuccess: () => {
                    window.location.reload();
                }
            });
        }
    };

    return (
        <Card
            draggable
            onDragStart={(e) => onDragStart(e, deal)}
            onDragEnd={onDragEnd}
            className={`cursor-move hover:shadow-md transition-shadow duration-200 ${
                isDragging ? 'opacity-50' : ''
            }`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-medium">{deal.name}</div>
                        <div className="text-sm text-gray-500">{deal.client?.name || 'Нет клиента'}</div>
                        <div className="text-sm font-medium mt-2">
                            {formatCurrency(deal.value)}
                        </div>
                    </div>
                    {can?.delete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="h-8 w-8"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 
import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { formatCurrency } from '@/utils/dealUtils';

export default function DealCard({ deal, isDragging, onDragStart, onDragEnd, onClick }) {
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
                <div className="font-medium">{deal.name}</div>
                <div className="text-sm text-gray-500">{deal.client.name}</div>
                <div className="text-sm font-medium mt-2">
                    {formatCurrency(deal.value)}
                </div>
            </CardContent>
        </Card>
    );
} 
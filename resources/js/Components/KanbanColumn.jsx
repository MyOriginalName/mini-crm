import React from 'react';
import DealCard from './DealCard';
import { STATUS_LABELS, STATUS_COLORS } from '@/constants/dealStatuses';

export default function KanbanColumn({ status, deals, draggedDeal, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onDealClick, can }) {
    return (
        <div
            className={`${STATUS_COLORS[status]} p-4 rounded-lg transition-colors duration-200`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="font-semibold mb-4">{STATUS_LABELS[status]}</h3>
            <div className="space-y-4">
                {deals[status]?.map((deal) => (
                    <DealCard
                        key={deal.id}
                        deal={deal}
                        isDragging={draggedDeal?.id === deal.id}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onClick={() => onDealClick(deal.id)}
                        can={can}
                    />
                ))}
            </div>
        </div>
    );
} 
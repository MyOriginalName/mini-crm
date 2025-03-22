import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '@/constants/taskConstants';
import { router } from '@inertiajs/react';

export default function TaskList({ tasks }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Приоритет</TableHead>
          <TableHead>Срок</TableHead>
          <TableHead>Исполнитель</TableHead>
          <TableHead>Клиент/Сделка</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.data.map((task) => (
          <TableRow
            key={task.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => router.get(route('tasks.show', task.id))}
          >
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-sm ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-sm ${PRIORITY_COLORS[task.priority]}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>
            </TableCell>
            <TableCell>
              {new Date(task.deadline).toLocaleDateString('ru-RU')}
            </TableCell>
            <TableCell>{task.user.name}</TableCell>
            <TableCell>
              {task.client ? task.client.name : ''}
              {task.deal ? ` / ${task.deal.name}` : ''}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 
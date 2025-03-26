import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
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
              <span className={`px-2 py-1 rounded-full text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {task.status_label}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-sm ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {task.priority_label}
              </span>
            </TableCell>
            <TableCell>
              {task.due_date_formatted}
            </TableCell>
            <TableCell>{task.user?.name || 'Не назначен'}</TableCell>
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
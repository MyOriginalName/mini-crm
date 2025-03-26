import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { CLIENT_STATUS_LABELS, CLIENT_TYPE_LABELS, CLIENT_STATUS_COLORS, CLIENT_TYPE, CLIENT_STATUS } from '@/constants/clientConstants';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Pencil, Eye } from 'lucide-react';

export default function ClientList({ clients }) {
  const handleEdit = (e, clientId) => {
    e.stopPropagation();
    router.get(route('clients.edit', clientId));
  };

  const handleView = (e, clientId) => {
    e.stopPropagation();
    router.get(route('clients.show', clientId));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Имя</TableHead>
          <TableHead>Тип</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Телефон</TableHead>
          <TableHead>Компания</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.data.map((client) => (
          <TableRow
            key={client.id}
            className="hover:bg-gray-50"
          >
            <TableCell>{client.name}</TableCell>
            <TableCell>{CLIENT_TYPE_LABELS[client.type]}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-sm ${CLIENT_STATUS_COLORS[client.status]}`}>
                {CLIENT_STATUS_LABELS[client.status]}
              </span>
            </TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>{client.company_name || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleView(e, client.id)}
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleEdit(e, client.id)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

ClientList.propTypes = {
  clients: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(CLIENT_TYPE)).isRequired,
      status: PropTypes.oneOf(Object.values(CLIENT_STATUS)).isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      company_name: PropTypes.string,
    })).isRequired,
  }).isRequired,
}; 
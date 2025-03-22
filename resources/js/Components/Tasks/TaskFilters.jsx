import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/constants/taskConstants';

export default function TaskFilters({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  clients,
  deals,
  users,
}) {
  const handleChange = (name, value) => {
    onFiltersChange({ ...filters, [name]: value });
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4 px-6">
        <form onSubmit={onSearch}>
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Поиск по названию или описанию"
                  value={filters.search}
                  onChange={(e) => handleChange('search', e.target.value)}
                  className="h-9"
                />
                <Select
                  value={filters.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все статусы</option>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
                <Select
                  value={filters.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все приоритеты</option>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Select
                  value={filters.client_id}
                  onChange={(e) => handleChange('client_id', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все клиенты</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </Select>
                <Select
                  value={filters.deal_id}
                  onChange={(e) => handleChange('deal_id', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все сделки</option>
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>{deal.name}</option>
                  ))}
                </Select>
                <Select
                  value={filters.user_id}
                  onChange={(e) => handleChange('user_id', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все исполнители</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <Button type="submit" className="h-9 px-6">Поиск</Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="h-9 px-6"
              >
                Сбросить
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
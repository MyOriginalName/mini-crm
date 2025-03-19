import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import { Select } from '@/Components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { router } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';

const statusColors = {
  suspended: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const statusLabels = {
  suspended: 'Приостановлена',
  in_progress: 'В работе',
  won: 'Выиграна',
  lost: 'Проиграна',
};

export default function Index({ auth, deals, filters, statistics, clients }) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    client_id: '',
    value: '',
    status: 'suspended',
    description: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = route('deals.index', {
      search: search,
      status: selectedStatus,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('');
    window.location.href = route('deals.index');
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    router.post(route('deals.store'), newDeal, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewDeal({
          name: '',
          client_id: '',
          value: '',
          status: 'suspended',
          description: ''
        });
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Сделки" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Сделки</h2>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="icon"
                className="h-9 w-9"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => window.location.href = route('deals.kanban')}
              >
                Канбан
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {statistics && statistics.map((stat) => (
              <Card key={stat.status}>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">{statusLabels[stat.status]}</div>
                  <div className="text-2xl font-bold mt-1">{stat.count}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB'
                    }).format(stat.total_value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardContent className="py-8 px-6">
              <form onSubmit={handleSearch} className="flex items-center justify-center gap-4 flex-wrap">
                <Input
                  type="text"
                  placeholder="Поиск по названию или клиенту"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-[200px]"
                >
                  <option value="">Все статусы</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
                <Button type="submit" className="w-[120px]">Поиск</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="w-[120px]"
                >
                  Сбросить
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.data.map((deal) => (
                    <TableRow
                      key={deal.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => window.location.href = route('deals.show', deal.id)}
                    >
                      <TableCell>{deal.name}</TableCell>
                      <TableCell>{deal.client.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[deal.status]}`}>
                          {statusLabels[deal.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('ru-RU', {
                          style: 'currency',
                          currency: 'RUB'
                        }).format(deal.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Создать сделку</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название сделки</Label>
                  <Input
                    id="name"
                    value={newDeal.name}
                    onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                    placeholder="Введите название сделки"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client">Клиент</Label>
                  <Select
                    id="client"
                    value={newDeal.client_id}
                    onChange={(e) => setNewDeal({ ...newDeal, client_id: e.target.value })}
                    required
                  >
                    <option value="">Выберите клиента</option>
                    {clients?.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Сумма сделки</Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    placeholder="Введите сумму сделки"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    id="status"
                    value={newDeal.status}
                    onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value })}
                    required
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <textarea
                    id="description"
                    value={newDeal.description}
                    onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                    placeholder="Введите описание сделки"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">Создать</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
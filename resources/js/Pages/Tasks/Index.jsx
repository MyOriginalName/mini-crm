import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import { Select } from '@/Components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { router } from '@inertiajs/react';

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Отменено',
};

const priorityLabels = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function Index({ auth, tasks, filters, clients, deals, users }) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
  const [selectedClient, setSelectedClient] = useState(filters.client_id || '');
  const [selectedDeal, setSelectedDeal] = useState(filters.deal_id || '');
  const [selectedUser, setSelectedUser] = useState(filters.user_id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    deadline: '',
    user_id: '',
    client_id: '',
    deal_id: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = route('tasks.index', {
      search,
      status: selectedStatus,
      priority: selectedPriority,
      client_id: selectedClient,
      deal_id: selectedDeal,
      user_id: selectedUser,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedClient('');
    setSelectedDeal('');
    setSelectedUser('');
    window.location.href = route('tasks.index');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    router.post(route('tasks.store'), newTask, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewTask({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          deadline: '',
          user_id: '',
          client_id: '',
          deal_id: '',
        });
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Задачи" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Задачи</h2>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Новая задача
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="py-4 px-6">
              <form onSubmit={handleSearch}>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Input
                        type="text"
                        placeholder="Поиск по названию или описанию"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9"
                      />
                      <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-9"
                      >
                        <option value="">Все статусы</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </Select>
                      <Select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="h-9"
                      >
                        <option value="">Все приоритеты</option>
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="h-9"
                      >
                        <option value="">Все клиенты</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </Select>
                      <Select
                        value={selectedDeal}
                        onChange={(e) => setSelectedDeal(e.target.value)}
                        className="h-9"
                      >
                        <option value="">Все сделки</option>
                        {deals.map((deal) => (
                          <option key={deal.id} value={deal.id}>{deal.name}</option>
                        ))}
                      </Select>
                      <Select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
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
                      onClick={clearFilters}
                      className="h-9 px-6"
                    >
                      Сбросить
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
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
                      onClick={() => window.location.href = route('tasks.show', task.id)}
                    >
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
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
            </CardContent>
          </Card>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Создать задачу</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название задачи</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Введите название задачи"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Введите описание задачи"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    id="status"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    required
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    required
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Срок выполнения</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user">Исполнитель</Label>
                  <Select
                    id="user"
                    value={newTask.user_id}
                    onChange={(e) => setNewTask({ ...newTask, user_id: e.target.value })}
                    required
                  >
                    <option value="">Выберите исполнителя</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Клиент</Label>
                  <Select
                    id="client"
                    value={newTask.client_id}
                    onChange={(e) => setNewTask({ ...newTask, client_id: e.target.value })}
                  >
                    <option value="">Выберите клиента</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deal">Сделка</Label>
                  <Select
                    id="deal"
                    value={newTask.deal_id}
                    onChange={(e) => setNewTask({ ...newTask, deal_id: e.target.value })}
                  >
                    <option value="">Выберите сделку</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>{deal.name}</option>
                    ))}
                  </Select>
                </div>

                <DialogFooter>
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
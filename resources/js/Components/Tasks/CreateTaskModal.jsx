import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Select } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, INITIAL_TASK_STATE } from '@/constants/taskConstants';

export default function CreateTaskModal({
  isOpen,
  onOpenChange,
  onSubmit,
  task,
  onTaskChange,
  users,
  clients,
  deals,
}) {
  const handleChange = (name, value) => {
    onTaskChange({ ...task, [name]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать задачу</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название задачи</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              value={task.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Введите описание задачи"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select
              id="status"
              value={task.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
            >
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет</Label>
            <Select
              id="priority"
              value={task.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              required
            >
              {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Срок выполнения</Label>
            <Input
              id="deadline"
              type="date"
              value={task.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Исполнитель</Label>
            <Select
              id="user"
              value={task.user_id}
              onChange={(e) => handleChange('user_id', e.target.value)}
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
              value={task.client_id}
              onChange={(e) => handleChange('client_id', e.target.value)}
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
              value={task.deal_id}
              onChange={(e) => handleChange('deal_id', e.target.value)}
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
  );
} 
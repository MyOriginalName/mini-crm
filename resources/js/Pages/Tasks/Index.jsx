import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import TaskFilters from '@/Components/Tasks/TaskFilters';
import TaskList from '@/Components/Tasks/TaskList';
import CreateTaskModal from '@/Components/Tasks/CreateTaskModal';
import { INITIAL_TASK_STATE } from '@/constants/taskConstants';

export default function Index({ auth, tasks, filters, clients, deals, users }) {
  const [filterState, setFilterState] = useState({
    search: filters.search || '',
    status: filters.status || '',
    priority: filters.priority || '',
    client_id: filters.client_id || '',
    deal_id: filters.deal_id || '',
    user_id: filters.user_id || '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState(INITIAL_TASK_STATE);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('tasks.index'), filterState, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const clearFilters = () => {
    setFilterState({
      search: '',
      status: '',
      priority: '',
      client_id: '',
      deal_id: '',
      user_id: '',
    });
    router.get(route('tasks.index'));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    router.post(route('tasks.store'), newTask, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewTask(INITIAL_TASK_STATE);
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

          <TaskFilters
            filters={filterState}
            onFiltersChange={setFilterState}
            onSearch={handleSearch}
            onClear={clearFilters}
            clients={clients}
            deals={deals}
            users={users}
          />

          <Card>
            <CardContent className="p-6">
              <TaskList tasks={tasks} />
            </CardContent>
          </Card>

          <CreateTaskModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateTask}
            task={newTask}
            onTaskChange={setNewTask}
            users={users}
            clients={clients}
            deals={deals}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
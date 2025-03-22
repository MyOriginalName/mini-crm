import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import ClientFilters from '@/Components/Clients/ClientFilters';
import ClientList from '@/Components/Clients/ClientList';
import CreateClientModal from '@/Components/Clients/CreateClientModal';
import { INITIAL_CLIENT_STATE } from '@/constants/clientConstants';

const cleanFilters = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );
};

export default function Index({ auth, clients, filters: initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleSearch = (e) => {
    e?.preventDefault();
    router.get(route('clients.index'), cleanFilters(filters), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleClear = () => {
    const emptyFilters = {
      search: '',
      status: null,
      type: '',
    };
    setFilters(emptyFilters);
    router.get(route('clients.index'), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClient, setNewClient] = useState(INITIAL_CLIENT_STATE);

  const handleCreateClient = (e) => {
    e.preventDefault();
    router.post(route('clients.store'), newClient, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewClient(INITIAL_CLIENT_STATE);
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Клиенты" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Клиенты</h2>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Новый клиент
            </Button>
          </div>

          <ClientFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <Card>
            <CardContent className="p-6">
              <ClientList clients={clients} />
            </CardContent>
          </Card>

          <CreateClientModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateClient}
            client={newClient}
            onClientChange={setNewClient}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClientsContext } from "./ClientsWidgetContext";
import { Link } from "@inertiajs/react";
import axios from 'axios';

function ClientsWidget() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const { refreshTrigger } = useClientsContext();

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger, filters]);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.phone) params.phone = filters.phone;
      
      const response = await axios.get(route('clients.widget'), { params });
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Ошибка при загрузке клиентов");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      phone: ""
    });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="drag-handle bg-gray-50 px-4 py-3 border-b cursor-move select-none">
        <h2 className="text-xl font-bold">Клиенты</h2>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            name="name"
            placeholder="Поиск по имени"
            value={filters.name}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px]"
          />
          <Input
            type="text"
            name="email"
            placeholder="Поиск по email"
            value={filters.email}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px]"
          />
          <Input
            type="text"
            name="phone"
            placeholder="Поиск по телефону"
            value={filters.phone}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px]"
          />
          <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
            Сбросить
          </Button>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : clients.length > 0 ? (
            <div className="h-full overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link
                            href={route('clients.show', client.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Button variant="outline" size="sm">
                              Просмотр
                            </Button>
                          </Link>
                          <Link
                            href={route('clients.edit', client.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Button variant="outline" size="sm">
                              Редактировать
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">Клиенты не найдены</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ClientsWidget;
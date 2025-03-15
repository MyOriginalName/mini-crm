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
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.phone) params.append('phone', filters.phone);
      
      const response = await axios.get(`/clients/widget?${params.toString()}`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Ошибка при загрузке клиентов");
    } finally {
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
    <Card className="w-full">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Клиенты</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            name="name"
            placeholder="Поиск по имени"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full sm:w-auto"
          />
          <Input
            type="text"
            name="email"
            placeholder="Поиск по email"
            value={filters.email}
            onChange={handleFilterChange}
            className="w-full sm:w-auto"
          />
          <Input
            type="text"
            name="phone"
            placeholder="Поиск по телефону"
            value={filters.phone}
            onChange={handleFilterChange}
            className="w-full sm:w-auto"
          />
          <Button variant="outline" onClick={clearFilters}>Сбросить</Button>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {loading ? (
          <p>Загрузка...</p>
        ) : clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                          href={`/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Button variant="outline" size="sm">
                            Просмотр
                          </Button>
                        </Link>
                        <Link
                          href={`/clients/${client.id}/edit`}
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
          <p>Клиенты не найдены</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ClientsWidget;
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import customAxios from "../utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClientsContext } from "./ClientsWidgetContext";
import { getAuthToken, initSanctumAuth } from "../utils/loginService";
import { removeStorageItem } from "../utils/localStorage";

function ClientsWidget() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const { refreshTrigger } = useClientsContext();

  useEffect(() => {
    // Initialize Sanctum and fetch clients
    const init = async () => {
      try {
        // Initialize Sanctum first to ensure CSRF protection
        await initSanctumAuth();
        
        // Then check for auth token
        const token = getAuthToken();
        if (!token) {
          console.error('No auth token available');
          // window.location.href = '/login';
          return;
        }
        
        // Finally fetch clients
        await fetchClients();
      } catch (error) {
        console.error('Failed to initialize:', error);
        // window.location.href = '/login';
      }
    };
    init();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token available');
      // window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.phone) params.phone = filters.phone;
      
      // Get CSRF cookie and verify auth token
      try {
        const { initSanctumAuth } = await import('../utils/loginService');
        await initSanctumAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // window.location.href = '/login';
        // return;
      }
      // Use full path to avoid baseURL issues
      // Make the API request with token auth
      const response = await customAxios.get('/clients', { params });
      
      // Validate response
      if (response.status !== 200) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Add detailed logging
      console.log('Clients request details:', {
        config: response.config,
        status: response.status,
        headers: response.headers
      });
      
      if (!response.data) {
        throw new Error('No data received from clients API');
      }
      
      console.log('API Response:', {
        status: response.status,
        hasData: !!response.data,
        dataLength: response.data?.length || 0
      });
      
      // Reverse the order of clients to display from the end
      setClients([...response.data].reverse());
    } catch (error) {
      console.error("Error fetching clients:", error);
      if (error.response && error.response.status === 401) {
        console.error('Authentication token expired or invalid');
        // Clear any existing tokens
        removeStorageItem('token');
        
        // Redirect to login page
        // if (!window.location.href.includes('login')) {
        //   window.location.href = '/login';
        // } else {
        //   setClients([]);
        // }
      } else {
        // Reset redirect counter for non-auth errors
        sessionStorage.removeItem('redirectCount');
      }
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

  const applyFilters = () => {
    fetchClients();
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      phone: ""
    });
    fetchClients();
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
          <Button onClick={applyFilters}>Применить фильтры</Button>
          <Button variant="outline" onClick={clearFilters}>Сбросить</Button>
        </div>

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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
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
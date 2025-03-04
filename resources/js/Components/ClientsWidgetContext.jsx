import { createContext, useContext, useState } from "react";

// Create a context for client data and refresh function
const ClientsWidgetContext = createContext();

export function ClientsWidgetProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to trigger a refresh of clients
  const refreshClients = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ClientsWidgetContext.Provider value={{ refreshTrigger, refreshClients }}>
      {children}
    </ClientsWidgetContext.Provider>
  );
}

// Custom hook to use the clients context
export function useClientsContext() {
  return useContext(ClientsWidgetContext);
}
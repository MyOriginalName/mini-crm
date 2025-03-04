import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/v1/user');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.visit('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    // Show loading indicator or nothing while checking authentication
    return null;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return children;
}
# Solution to 401 Unauthorized API Request Issue

## Problem
The application was experiencing 401 Unauthorized errors when trying to access the `/api/v1/clients` endpoint. This was preventing users from viewing or creating clients.

## Root Cause
The root cause was a mismatch in authentication approaches:

1. The backend API is secured with Laravel Sanctum's cookie-based authentication (`auth:sanctum` middleware)
2. The frontend React application was attempting to use a token from localStorage for authentication
3. The axios requests were not sending credentials (cookies) with requests
4. CSRF token was not properly included in requests as required by Laravel

## Solution Implemented

### 1. Configure Axios to work with Cookie-based Authentication

In `bootstrap.js`:
```javascript
// Enable credentials (cookies) to be sent with cross-origin requests
window.axios.defaults.withCredentials = true;

// Add CSRF token to all requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
```

### 2. Update Authentication Verification in PrivateRoute

Modified `PrivateRoute.jsx` to:
- Use proper API verification instead of checking localStorage
- Add loading state handling
- Properly redirect to login page when needed

```javascript
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
```

### 3. Add Proper Error Handling

Added consistent 401 error handling in both components:

In `ClientsWidget.jsx` and `CreateClientWidget.jsx`:
```javascript
if (error.response && error.response.status === 401) {
  // Redirect to login page if unauthorized
  window.location.href = '/login';
}
```

## How This Works

1. When a user logs in through the Login page, Laravel creates a session and sets cookies
2. Axios is now configured to include these cookies in every request (`withCredentials: true`)
3. The CSRF token is included in requests as required by Laravel's security
4. The PrivateRoute component verifies authentication by making an API call to check user status
5. If an API request returns a 401 error, the user is redirected to the login page

This approach properly aligns with Laravel Sanctum's SPA authentication system, which uses cookies for maintaining sessions.
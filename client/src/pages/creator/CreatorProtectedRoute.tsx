import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getCreatorToken } from '@/lib/creatorApi';

export function CreatorProtectedRoute() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => getCreatorToken());

  useEffect(() => {
    // Check token on mount and when location changes
    const currentToken = getCreatorToken();
    setToken(currentToken);
    
    // Listen for auth changes (custom event from login/logout)
    const handleAuthChange = () => {
      const newToken = getCreatorToken();
      setToken(newToken);
    };
    
    // Also listen for storage changes (in case token is set in another tab/window)
    const handleStorageChange = () => {
      const newToken = getCreatorToken();
      setToken(newToken);
    };

    window.addEventListener('creatorAuthChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('creatorAuthChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/creator/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}



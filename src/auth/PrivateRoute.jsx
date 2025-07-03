import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. While the authentication state is being determined, show a loading spinner.
  // This prevents a "flash" of the login page for already-logged-in users.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  // 2. If loading is finished and there is a user, render the requested page.
  if (user) {
    return children;
  }

  // 3. If loading is finished and there is no user, redirect to the login page.
  // We pass the current location in the state so we can redirect back after login.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateAdminRouteProps {
  children: React.ReactNode;
}

const PrivateAdminRoute: React.FC<PrivateAdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminToken');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateAdminRoute;
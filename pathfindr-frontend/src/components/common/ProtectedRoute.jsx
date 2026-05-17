import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on actual role if they try to access unauthorized area
    if (user.role === 'STUDENT') return <Navigate to="/dashboard" replace />;
    if (user.role === 'COUNSELOR') return <Navigate to="/counselor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

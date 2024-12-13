import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

interface ProtectedDashboardProps {
  children: React.ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const { isAuthenticated, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only redirect if we're definitely not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we're still loading or authenticated, render children
  return <>{children}</>;
}
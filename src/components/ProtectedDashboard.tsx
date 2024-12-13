import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedDashboardProps {
  children: React.ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const { isAuthenticated, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Only redirect if we're definitely not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we're still loading or authenticated, render children
  return <>{children}</>;
}
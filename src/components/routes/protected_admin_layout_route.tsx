import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../constants/routes';
import { AdminLayout } from '../layouts/admin_layout';

interface ProtectedAdminLayoutRouteProps {
  children: ReactNode;
}

/**
 * Protected Admin Layout Route Component
 * Wraps admin pages with AdminLayout and ensures admin authentication
 */
export const ProtectedAdminLayoutRoute: React.FC<ProtectedAdminLayoutRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-primary)]">Loading...</div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.admin.login} replace />;
  }

  // Redirect to admin login if user is not an admin
  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.admin.login} replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};


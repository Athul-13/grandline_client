import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
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
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  // Ensure spinner shows for at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication or during minimum delay
  if (isLoading || !minDelayPassed) {
    return (
      <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
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


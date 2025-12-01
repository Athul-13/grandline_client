import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Protected Route Component
 * Only allows access to authenticated users with 'user' role
 * Blocks admin users - they must use admin routes
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  // Block admin users from accessing user routes
  if (user?.role === 'admin') {
    return <Navigate to={ROUTES.admin.dashboard} replace />;
  }

  return children;
};


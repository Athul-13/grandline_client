import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../constants/routes';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface PublicRouteProps {
  children: React.ReactElement;
  redirectTo?: string;
}

/**
 * Public Only Route Component
 * Redirects authenticated users to specified path (or role-based default)
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-(--color-bg-primary)/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    // If redirectTo is provided, use it
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    // Otherwise, use role-based redirect
    if (user?.role === 'admin') {
      return <Navigate to={ROUTES.admin.dashboard} replace />;
    }
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children;
};


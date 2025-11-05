import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../constants/routes';

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
      <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center">
        <div className="text-(--color-text-primary)">Loading...</div>
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


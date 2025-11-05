import { Navigate } from 'react-router-dom';
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center">
        <div className="text-(--color-text-primary)">Loading...</div>
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


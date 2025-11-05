import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../constants/routes';

interface AdminProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Admin Protected Route Component
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center">
        <div className="text-(--color-text-primary)">Loading...</div>
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

  return children;
};


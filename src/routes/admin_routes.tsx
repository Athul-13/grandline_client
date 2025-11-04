import { Routes, Route } from 'react-router-dom';
import { PublicRoute } from '../components/routes/public_route';
import { AdminProtectedRoute } from '../components/routes/admin_protected_route';
import { AdminLoginPage } from '../pages/auth/admin_login_page';
import { AdminDashboardPage } from '../pages/admin/admin_dashboard_page';

/**
 * Admin Routes Component
 * Handles all routes for admin users at "/admin/*"
 */
export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin login - public route, but redirects if already logged in as admin */}
      <Route
        path="login"
        element={
          <PublicRoute redirectTo="/admin/dashboard">
            <AdminLoginPage />
          </PublicRoute>
        }
      />

      {/* Admin dashboard - protected route, requires admin role */}
      <Route
        path="dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />

      {/* Default redirect - redirect to dashboard or login based on auth */}
      <Route
        index
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />

      {/* Fallback for unmatched routes */}
      <Route
        path="*"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};


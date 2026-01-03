import { Routes, Route } from 'react-router-dom';
import { PublicRoute } from '../components/routes/public_route';
import { ProtectedAdminLayoutRoute } from '../components/routes/protected_admin_layout_route';
import { AdminLoginPage } from '../pages/auth/admin_login_page';
import { AdminDashboardPage } from '../pages/admin/admin_dashboard_page';
import { AdminTripManagementPage } from '../pages/admin/admin_trip_management_page';
import { AdminQuotesPage } from '../pages/admin/admin_quotes_page';
import { AdminReservationsPage } from '../pages/admin/admin_reservations_page';
import { AdminFleetManagementPage } from '../pages/admin/admin_fleet_management_page';
import { AdminUserManagementPage } from '../pages/admin/admin_user_management_page';
import { AdminDriverManagementPage } from '../pages/admin/admin_driver_management_page';
import { AdminSupportConcernsPage } from '../pages/admin/admin_support_concerns_page';
import { AdminSettingsPage } from '../pages/admin/admin_settings_page';
import { ROUTES } from '../constants/routes';

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
          <PublicRoute redirectTo={ROUTES.admin.dashboard}>
            <AdminLoginPage />
          </PublicRoute>
        }
      />

      {/* Admin dashboard - protected route, requires admin role */}
      <Route
        path="dashboard"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminDashboardPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Trip Management - handles both list and details */}
      <Route
        path="trip-management"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminTripManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />
      <Route
        path="trip-management/:id"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminTripManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Quotes - handles both list and details */}
      <Route
        path="quotes"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminQuotesPage />
          </ProtectedAdminLayoutRoute>
        }
      />
      <Route
        path="quotes/:id"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminQuotesPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Reservations - handles both list and details */}
      <Route
        path="reservations"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminReservationsPage />
          </ProtectedAdminLayoutRoute>
        }
      />
      <Route
        path="reservations/:id"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminReservationsPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Fleet Management */}
      <Route
        path="fleet-management"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminFleetManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* User Management - handles both list and details */}
      <Route
        path="user-management"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminUserManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />
      <Route
        path="user-management/:id"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminUserManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Driver Management - handles both list and details */}
      <Route
        path="driver-management"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminDriverManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />
      <Route
        path="driver-management/:id"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminDriverManagementPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Support & Concerns */}
      <Route
        path="support-concerns"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminSupportConcernsPage />
          </ProtectedAdminLayoutRoute>
        }
      >
        <Route path=":id" element={<AdminSupportConcernsPage />} />
      </Route>

      {/* Settings */}
      <Route
        path="settings"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminSettingsPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Default redirect - redirect to dashboard or login based on auth */}
      <Route
        index
        element={
          <ProtectedAdminLayoutRoute>
            <AdminDashboardPage />
          </ProtectedAdminLayoutRoute>
        }
      />

      {/* Fallback for unmatched routes */}
      <Route
        path="*"
        element={
          <ProtectedAdminLayoutRoute>
            <AdminDashboardPage />
          </ProtectedAdminLayoutRoute>
        }
      />
    </Routes>
  );
};


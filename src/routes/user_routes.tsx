import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/routes/protected_route';
import { PublicRoute } from '../components/routes/public_route';
import { HomePage } from '../pages/user/home_page';
import { LoginPage } from '../pages/auth/login_page';
import { RegisterPage } from '../pages/auth/register_page';
import { OtpVerificationPage } from '../pages/auth/otp_verification_page';
import { ForgotPasswordPage } from '../pages/auth/forgot_password_page';
import { ResetPasswordPage } from '../pages/auth/reset_password_page';
import { DashboardPage } from '../pages/user/dashboard_page';

/**
 * User Routes Component
 * Handles all routes for regular users
 */
export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path="home"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="verify-otp"
        element={
          <PublicRoute>
            <OtpVerificationPage />
          </PublicRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};


import { Routes, Route } from 'react-router-dom';
import { PublicRoute } from '../components/routes/public_route';
import { ProtectedUserLayoutRoute } from '../components/routes/protected_user_layout_route';
import { HomePage } from '../pages/common/home_page';
import { LoginPage } from '../pages/auth/login_page';
import { RegisterPage } from '../pages/auth/register_page';
import { OtpVerificationPage } from '../pages/auth/otp_verification_page';
import { ForgotPasswordPage } from '../pages/auth/forgot_password_page';
import { ResetPasswordPage } from '../pages/auth/reset_password_page';
import { QuotesPage } from '../pages/user/quotes_page';
import { ReservationsPage } from '../pages/user/reservations_page';
import { BuildQuotePage } from '../pages/user/build_quote_page';
import { ProfilePage } from '../pages/user/profile/profile_page';
import { MyProfilePage } from '../pages/user/profile/my_profile_page';
import { SecurityPage } from '../pages/user/profile/security_page';
import { NotificationsPage } from '../pages/user/profile/notifications_page';
import { AccountSettingsPage } from '../pages/user/profile/account_settings_page';

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

      {/* Protected User Routes with Layout - Using wrapper to reduce redundancy */}
      {/* Dashboard shows Quotes page - they are the same */}
      <Route
        path="dashboard"
        element={
          <ProtectedUserLayoutRoute>
            <QuotesPage />
          </ProtectedUserLayoutRoute>
        }
      />
      <Route
        path="quotes"
        element={
          <ProtectedUserLayoutRoute>
            <QuotesPage />
          </ProtectedUserLayoutRoute>
        }
      />
      <Route
        path="reservations"
        element={
          <ProtectedUserLayoutRoute>
            <ReservationsPage />
          </ProtectedUserLayoutRoute>
        }
      />
      <Route
        path="build-quote"
        element={
          <ProtectedUserLayoutRoute>
            <BuildQuotePage />
          </ProtectedUserLayoutRoute>
        }
      />

      {/* Profile Routes with nested layout */}
      <Route
        path="profile"
        element={
          <ProtectedUserLayoutRoute>
            <ProfilePage />
          </ProtectedUserLayoutRoute>
        }
      >
        <Route index element={<MyProfilePage />} />
        <Route path="my-profile" element={<MyProfilePage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<AccountSettingsPage />} />
      </Route>
    </Routes>
  );
};


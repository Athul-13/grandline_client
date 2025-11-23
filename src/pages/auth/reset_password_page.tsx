import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ResetPasswordForm } from '../../components/auth/forms/reset_password_form';
import { ROUTES } from '../../constants/routes';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Redirect authenticated users away from reset password page
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = user?.role === 'admin' ? ROUTES.admin.dashboard : ROUTES.dashboard;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) {
    return null; // Don't render while redirecting
  }

  return (
    <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center px-4 py-12">
      <ResetPasswordForm />
    </div>
  );
};


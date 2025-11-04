import { ForgotPasswordForm } from '../../components/auth/forgot_password_form';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
};


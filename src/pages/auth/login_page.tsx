import { LoginForm } from '../../components/auth/login_form';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
};


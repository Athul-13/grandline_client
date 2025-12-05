import { AdminLoginForm } from '../../components/auth/forms/admin_login_form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';

export const AdminLoginPage: React.FC = () => {
  const { isLoading } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center px-4 py-12 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-(--color-bg-primary)/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
      <AdminLoginForm />
    </div>
  );
};


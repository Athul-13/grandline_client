import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutAsync } from '../../store/slices/auth_slice';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success('Logged out successfully');
      navigate(ROUTES.admin.login);
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary)">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className={cn(
              'px-4 py-2 rounded-lg font-medium',
              'bg-(--color-primary) hover:bg-(--color-primary-hover)',
              'text-white shadow-md hover:shadow-lg',
              'transition-all duration-200'
            )}
          >
            Logout
          </button>
        </div>
        
        <div className="bg-(--color-bg-card) rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.fullName || 'Admin'}!</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>
          </div>
          
          <div className="mt-8">
            <p className="text-(--color-text-secondary)">
              Admin dashboard features coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


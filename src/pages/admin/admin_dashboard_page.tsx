import { useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('admin.dashboard.welcome', { name: user?.fullName || 'Admin' })}
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">{t('admin.dashboard.email')}:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">{t('admin.dashboard.role')}:</span> {user?.role}
            </p>
          </div>
          
          <div className="mt-8">
            <p className="text-[var(--color-text-secondary)]">
              {t('admin.dashboard.comingSoon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


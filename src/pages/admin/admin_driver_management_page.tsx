import { useLanguage } from '../../hooks/use_language';

export const AdminDriverManagementPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {t('admin.sidebar.driverManagement') || 'Driver Management'}
          </h1>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-6">
          <p className="text-[var(--color-text-secondary)]">
            {t('admin.dashboard.comingSoon') || 'Driver management features coming soon...'}
          </p>
        </div>
      </div>
    </div>
  );
};


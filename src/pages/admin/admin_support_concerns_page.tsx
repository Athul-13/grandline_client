import { useLanguage } from '../../hooks/use_language';

export const AdminSupportConcernsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {t('admin.sidebar.supportConcerns') || 'Support & Concerns'}
          </h1>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-6">
          <p className="text-[var(--color-text-secondary)]">
            {t('admin.dashboard.comingSoon') || 'Support & concerns features coming soon...'}
          </p>
        </div>
      </div>
    </div>
  );
};


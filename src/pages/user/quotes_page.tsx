import { useLanguage } from '../../hooks/use_language';

/**
 * Quotes Page
 * Displays user quotes (dummy page for now)
 */
export const QuotesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {t('dashboard.quotes.title')}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t('dashboard.quotes.subtitle')}
        </p>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
        <p className="text-[var(--color-text-secondary)]">
          {t('dashboard.quotes.comingSoon')}
        </p>
      </div>
    </div>
  );
};


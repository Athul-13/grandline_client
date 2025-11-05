import { useLanguage } from '../../hooks/use_language';

/**
 * Build A Quote Page
 * Allows users to build a new quote (dummy page for now)
 */
export const BuildQuotePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {t('dashboard.buildQuote.title')}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t('dashboard.buildQuote.subtitle')}
        </p>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
        <p className="text-[var(--color-text-secondary)]">
          {t('dashboard.buildQuote.comingSoon')}
        </p>
      </div>
    </div>
  );
};


import { useLanguage } from '../../hooks/use_language';

/**
 * Reservations Page
 * Displays user reservations (dummy page for now)
 */
export const ReservationsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {t('dashboard.reservations.title')}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t('dashboard.reservations.subtitle')}
        </p>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
        <p className="text-[var(--color-text-secondary)]">
          {t('dashboard.reservations.comingSoon')}
        </p>
      </div>
    </div>
  );
};


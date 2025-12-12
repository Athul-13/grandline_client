import { User, Mail, Phone, DollarSign } from 'lucide-react';
import { useAdminDriverDetails } from '../../../../hooks/drivers/use_admin_driver_details';
import { formatPrice } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';

interface DriverInfoBentoCardProps {
  quoteDetails: QuoteResponse;
}

/**
 * Driver Info Bento Card Component
 * Displays assigned driver information in a bento card
 */
export const DriverInfoBentoCard: React.FC<DriverInfoBentoCardProps> = ({ quoteDetails }) => {
  const { driverDetails, isLoading, error } = useAdminDriverDetails(
    quoteDetails.assignedDriverId || ''
  );

  // Only show if driver is assigned
  if (!quoteDetails.assignedDriverId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Assigned Driver</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (error || !driverDetails) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Assigned Driver</h3>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          Driver information unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Assigned Driver</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Name:</span>
          </div>
          <p className="ml-6 text-sm text-[var(--color-text-primary)] font-medium">
            {driverDetails.fullName}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Email:</span>
          </div>
          <p className="ml-6 text-sm text-[var(--color-text-primary)]">
            {driverDetails.email}
          </p>
        </div>

        {driverDetails.phoneNumber && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Phone:</span>
            </div>
            <p className="ml-6 text-sm text-[var(--color-text-primary)]">
              {driverDetails.phoneNumber}
            </p>
          </div>
        )}

        {quoteDetails.actualDriverRate && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Rate:</span>
            </div>
            <p className="ml-6 text-sm text-[var(--color-text-primary)] font-medium">
              {formatPrice(quoteDetails.actualDriverRate)}/hr
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">License:</span>
          </div>
          <p className="ml-6 text-sm text-[var(--color-text-primary)] font-mono">
            {driverDetails.licenseNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

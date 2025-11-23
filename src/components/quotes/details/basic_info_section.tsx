import { FilterSection } from '../../common/filters/filter_section';
import { formatDateTime } from '../../../utils/quote_formatters';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface BasicInfoSectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Basic Information Section Component
 * Displays basic quote information
 */
export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Basic Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Trip Name:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.tripName || '-'}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Trip Type:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.tripType === 'one_way' ? 'One Way' : 'Two Way'}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Event Type:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.eventType || '-'}
          </span>
        </div>
        {quoteDetails.customEventType && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Custom Event Type:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {quoteDetails.customEventType}
            </span>
          </div>
        )}
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Passenger Count:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.passengerCount}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Current Step:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.currentStep} / 5
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Created At:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {formatDateTime(quoteDetails.createdAt)}
          </span>
        </div>
        {quoteDetails.updatedAt && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Updated At:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {formatDateTime(quoteDetails.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </FilterSection>
  );
};


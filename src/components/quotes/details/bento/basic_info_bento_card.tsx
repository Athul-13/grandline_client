import { Info } from 'lucide-react';
import { formatDateTime } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';

interface BasicInfoBentoCardProps {
  quoteDetails: QuoteResponse;
}

/**
 * Basic Info Bento Card Component
 * Displays basic quote information in a bento card
 */
export const BasicInfoBentoCard: React.FC<BasicInfoBentoCardProps> = ({ quoteDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Basic Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Quote Number:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.quoteNumber || '-'}
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
        <div>
        <span className="font-medium text-[var(--color-text-secondary)]">Custom Event Type:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {quoteDetails.customEventType || '-'}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Passenger Count:</span>
          <span className="ml-2 text-[var(--color-text-primary)] font-medium">
            {quoteDetails.passengerCount}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Status:</span>
          <span className="ml-2 text-[var(--color-text-primary)] capitalize">
            {quoteDetails.status.replace('_', ' ')}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Created:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {formatDateTime(quoteDetails.createdAt)}
          </span>
        </div>
        {quoteDetails.updatedAt && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Updated:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {formatDateTime(quoteDetails.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


import { FilterSection } from '../../common/filters/filter_section';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface UserInfoSectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * User Information Section Component
 * Displays user information associated with the quote
 */
export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="User Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {quoteDetails.user ? (
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">User ID:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {quoteDetails.user.userId}
            </span>
          </div>
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Full Name:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {quoteDetails.user.fullName}
            </span>
          </div>
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Email:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {quoteDetails.user.email}
            </span>
          </div>
          {quoteDetails.user.phoneNumber && (
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Phone Number:</span>
              <span className="ml-2 text-[var(--color-text-primary)]">
                {quoteDetails.user.phoneNumber}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">User information not available</p>
      )}
    </FilterSection>
  );
};


import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { formatDate } from '../../utils/quote_formatters';
import { DriverStatusBadge } from './driver_status_badge';
import { DriverOnboardingBadge } from './driver_onboarding_badge';
import type { AdminDriverListItem } from '../../types/drivers/admin_driver';

interface AdminDriversTableRowProps {
  driver: AdminDriverListItem;
  searchQuery: string;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onRowClick: () => void;
}

/**
 * Admin Drivers Table Row Component
 * Displays a single driver row in the desktop table view
 */
export const AdminDriversTableRow: React.FC<AdminDriversTableRowProps> = ({
  driver,
  searchQuery,
  isSelected,
  onSelectChange,
  onRowClick,
}) => {
  return (
    <tr
      className={cn(
        "flex hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer relative",
        isSelected && "bg-[var(--color-bg-secondary)]"
      )}
      onClick={onRowClick}
    >
      <td 
        className="px-4 py-3 flex-[0_0_40px] flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectChange(e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-[0_0_15%] min-w-0 overflow-hidden">
        {highlightSearchTerm(driver.fullName, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_18%] min-w-0 overflow-hidden">
        {highlightSearchTerm(driver.email, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_12%] min-w-0 overflow-hidden">
        {driver.phoneNumber ? highlightSearchTerm(driver.phoneNumber, searchQuery) : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_12%] min-w-0 overflow-hidden">
        {highlightSearchTerm(driver.licenseNumber, searchQuery)}
      </td>
      <td className="px-4 py-3 flex-[0_0_12%]">
        <DriverStatusBadge status={driver.status} />
      </td>
      <td className="px-4 py-3 flex-[0_0_12%]">
        <DriverOnboardingBadge isOnboarded={driver.isOnboarded} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_10%]">
        ${driver.salary.toFixed(2)}/hr
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_9%]">
        {formatDate(driver.createdAt)}
      </td>
    </tr>
  );
};


import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { formatDate } from '../../utils/quote_formatters';
import { UserStatusBadge } from './user_status_badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { AdminUserListItem } from '../../types/users/admin_user';

interface AdminUsersTableRowProps {
  user: AdminUserListItem;
  searchQuery: string;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onRowClick: () => void;
}

/**
 * Admin Users Table Row Component
 * Displays a single user row in the desktop table view
 */
export const AdminUsersTableRow: React.FC<AdminUsersTableRowProps> = ({
  user,
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
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-[0_0_18%] min-w-0 overflow-hidden">
        {highlightSearchTerm(user.fullName, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_20%] min-w-0 overflow-hidden">
        {highlightSearchTerm(user.email, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_15%] min-w-0 overflow-hidden">
        {highlightSearchTerm(user.phoneNumber, searchQuery)}
      </td>
      <td className="px-4 py-3 flex-[0_0_12%]">
        <UserStatusBadge status={user.status} />
      </td>
      <td className="px-4 py-3 flex-[0_0_10%]">
        {user.isVerified ? (
          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Verified</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs">Unverified</span>
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_15%]">
        {formatDate(user.createdAt)}
      </td>
    </tr>
  );
};


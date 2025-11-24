import { Button } from '../common/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface QuotesTableActionHeaderProps {
  selectedCount: number;
  allSelected: boolean;
  onSelectAll: (isSelected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDeselectAll: () => void;
}

/**
 * Quotes Table Action Header Component
 * Displays action buttons in the table header when quotes are selected
 */
export const QuotesTableActionHeader: React.FC<QuotesTableActionHeaderProps> = ({
  selectedCount,
  allSelected,
  onSelectAll,
  onEdit,
  onDelete,
  onDeselectAll,
}) => {
  return (
    <div className="flex items-center px-4 py-3 h-[48px]">
      <div className="flex-[0_0_40px]">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="flex-1 flex items-center gap-3">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {selectedCount} selected
        </span>
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-sm flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-sm flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
        <button
          onClick={onDeselectAll}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Deselect all
        </button>
      </div>
    </div>
  );
};


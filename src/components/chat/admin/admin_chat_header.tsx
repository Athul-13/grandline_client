import { ArrowLeft } from 'lucide-react';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface AdminChatHeaderProps {
  quoteDetails: AdminQuoteDetails;
  onBack: () => void;
}

/**
 * Admin Chat Header Component
 * Displays quote info and back button in chat view
 */
export const AdminChatHeader: React.FC<AdminChatHeaderProps> = ({ quoteDetails, onBack }) => {
  return (
    <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
            title="Back to quote details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Chat</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">
              Quote: {quoteDetails.quoteId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


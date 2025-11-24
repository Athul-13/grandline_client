import { ArrowLeft } from 'lucide-react';
import { AdminChatBody } from '../admin/admin_chat_body';
import { AdminChatInput } from '../admin/admin_chat_input';
import type { QuoteResponse } from '../../../types/quotes/quote';
import type { Message } from '../../../types/chat/message';

interface UserChatViewProps {
  quoteDetails: QuoteResponse;
  messages: Message[];
  currentUserId: string;
  isTyping?: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

/**
 * User Chat View Component
 * Main chat view for users (similar structure to admin)
 */
export const UserChatView: React.FC<UserChatViewProps> = ({
  quoteDetails,
  messages,
  currentUserId,
  isTyping = false,
  isLoading = false,
  onBack,
  onSendMessage,
}) => {
  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Chat Header */}
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
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Chat with Admin
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                Quote: {quoteDetails.quoteId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Body - Messages */}
      <AdminChatBody
        messages={messages}
        currentUserId={currentUserId}
        otherUserName="Admin"
        isTyping={isTyping}
        isLoading={isLoading}
      />

      {/* Chat Input */}
      <AdminChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};


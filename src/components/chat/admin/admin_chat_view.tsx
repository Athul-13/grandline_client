import { AdminChatHeader } from './admin_chat_header';
import { AdminChatBody } from './admin_chat_body';
import { AdminChatInput } from './admin_chat_input';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';
import type { Message } from '../../../types/chat/message';

interface AdminChatViewProps {
  quoteDetails: AdminQuoteDetails;
  messages: Message[];
  currentUserId: string;
  otherUserName?: string;
  isTyping?: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

/**
 * Admin Chat View Component
 * Main chat view with table-like structure (header + body)
 */
export const AdminChatView: React.FC<AdminChatViewProps> = ({
  quoteDetails,
  messages,
  currentUserId,
  otherUserName,
  isTyping = false,
  isLoading = false,
  onBack,
  onSendMessage,
}) => {
  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Chat Header */}
      <AdminChatHeader quoteDetails={quoteDetails} onBack={onBack} />

      {/* Chat Body - Messages */}
      <AdminChatBody
        messages={messages}
        currentUserId={currentUserId}
        otherUserName={otherUserName}
        isTyping={isTyping}
        isLoading={isLoading}
      />

      {/* Chat Input */}
      <AdminChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};


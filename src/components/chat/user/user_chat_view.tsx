import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { useSocketConnection } from '../../../hooks/chat/use_socket_connection';
import { useChatForQuote } from '../../../hooks/chat/use_chat_for_quote';
import { useChatMessages } from '../../../hooks/chat/use_chat_messages';
import { AdminChatBody } from '../admin/admin_chat_body';
import { AdminChatInput } from '../admin/admin_chat_input';
import type { QuoteResponse } from '../../../types/quotes/quote';

interface UserChatViewProps {
  quoteDetails: QuoteResponse;
  onBack: () => void;
}

/**
 * User Chat View Component
 * Main chat view for users (similar structure to admin)
 * Integrated with Socket.io for real-time functionality
 */
export const UserChatView: React.FC<UserChatViewProps> = ({ quoteDetails, onBack }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.userId || '';

  // Socket connection
  const { isConnected } = useSocketConnection();

  // Get or create chat for quote
  const { chat, isLoading: isLoadingChat, isJoined } = useChatForQuote({
    quoteId: quoteDetails.quoteId,
    userId: quoteDetails.userId,
  });

  // Fetch and manage messages
  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
    markAsRead,
  } = useChatMessages({
    chatId: chat?.chatId || null,
    autoFetch: true,
  });

  // Mark messages as read when viewing chat
  useEffect(() => {
    if (chat?.chatId && isJoined && messages.length > 0) {
      markAsRead();
    }
  }, [chat?.chatId, isJoined, messages.length, markAsRead]);

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
        chatId={chat?.chatId || null}
        isLoading={isLoadingChat || isLoadingMessages}
      />

      {/* Chat Input */}
      <AdminChatInput
        onSendMessage={sendMessage}
        chatId={chat?.chatId || null}
        disabled={isLoadingChat || isLoadingMessages || !isConnected || !chat?.chatId}
      />
    </div>
  );
};


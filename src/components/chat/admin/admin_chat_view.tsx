import { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useSocketConnection } from '../../../hooks/chat/use_socket_connection';
import { useChatForQuote } from '../../../hooks/chat/use_chat_for_quote';
import { useChatMessages } from '../../../hooks/chat/use_chat_messages';
import { AdminChatHeader } from './admin_chat_header';
import { AdminChatBody } from './admin_chat_body';
import { AdminChatInput } from './admin_chat_input';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface AdminChatViewProps {
  quoteDetails: AdminQuoteDetails;
  onBack: () => void;
}

/**
 * Admin Chat View Component
 * Main chat view with table-like structure (header + body)
 * Integrated with Socket.io for real-time functionality
 */
export const AdminChatView: React.FC<AdminChatViewProps> = ({ quoteDetails, onBack }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.userId || '';

  // Socket connection
  const { isConnected } = useSocketConnection();

  // Get or create chat for quote
  const { chat, isLoading: isLoadingChat, isJoined } = useChatForQuote({
    quoteId: quoteDetails.quoteId,
    userId: quoteDetails.user?.userId || '',
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

  // Get other user name (user from quote)
  const otherUserName = quoteDetails.user?.fullName || 'User';

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Chat Header */}
      <AdminChatHeader quoteDetails={quoteDetails} onBack={onBack} />

      {/* Chat Body - Messages */}
      <AdminChatBody
        messages={messages}
        currentUserId={currentUserId}
        otherUserName={otherUserName}
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


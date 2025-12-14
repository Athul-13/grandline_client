import { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useSocketConnection } from '../../../hooks/chat/use_socket_connection';
import { useChatMessages } from '../../../hooks/chat/use_chat_messages';
import { AdminChatHeader } from './admin_chat_header';
import { AdminChatBody } from './admin_chat_body';
import { AdminChatInput } from './admin_chat_input';
import { ConnectionStatus } from '../common/connection_status';
import { ErrorMessage } from '../../common/ui/error_message';
import type { Chat } from '../../../types/chat/chat';

interface AdminChatViewProps {
  chat: Chat | null;
  contextType: string;   // e.g., 'quote', 'driver'
  contextId: string;     // e.g., quote ID, driver ID
  contextLabel: string;  // e.g., 'Quote', 'Driver'
  otherUserName: string; // Name of the other party (user or driver)
  isLoadingChat: boolean;
  chatError: string | null;
  isJoined: boolean;
  joinChat: () => Promise<void>;
  refetchChat: () => Promise<void>;
  onBack: () => void;
}

/**
 * Admin Chat View Component
 * Generic chat view that works with any context (quotes, drivers, etc.)
 * Integrated with Socket.io for real-time functionality
 */
export const AdminChatView: React.FC<AdminChatViewProps> = ({
  chat,
  contextType,
  contextId,
  contextLabel,
  otherUserName,
  isLoadingChat,
  chatError,
  isJoined,
  joinChat,
  refetchChat,
  onBack,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.userId || '';

  // Socket connection
  const { isConnected, isConnecting, error: socketError, reconnect } = useSocketConnection();

  // Explicitly join chat room when chat view opens and chat is available
  useEffect(() => {
    if (chat?.chatId && !isJoined && isConnected) {
      joinChat();
    }
  }, [chat?.chatId, isJoined, isConnected, joinChat]);

  // Fetch and manage messages
  const {
    messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    sendMessage,
  } = useChatMessages({
    chatId: chat?.chatId || null,
    contextId: contextId,
    contextType,
    isJoined,
    onChatCreated: () => {
      // Refetch chat after first message creates it
      refetchChat();
    },
    autoFetch: true,
  });

  // Debug: Check input disabled state
  useEffect(() => {
    const disabled = isLoadingChat || isLoadingMessages || !isConnected;
    console.log('🔍 Chat Input Debug (Admin):', {
      isLoadingChat,
      isLoadingMessages,
      isConnected,
      chatId: chat?.chatId,
      chat: chat,
      disabled,
      reasons: {
        'Loading Chat': isLoadingChat,
        'Loading Messages': isLoadingMessages,
        'Not Connected': !isConnected,
      },
    });
  }, [isLoadingChat, isLoadingMessages, isConnected, chat]);

  // Show error if chat failed to load
  if (chatError && !isLoadingChat) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        <AdminChatHeader contextLabel={contextLabel} contextId={contextId} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ErrorMessage message={chatError} />
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Chat Header */}
      <AdminChatHeader contextLabel={contextLabel} contextId={contextId} onBack={onBack} />

      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={socketError}
        onReconnect={reconnect}
      />

      {/* Error Message for Messages */}
      {messagesError && (
        <div className="px-4 pt-2">
          <ErrorMessage message={messagesError} />
        </div>
      )}

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
        disabled={isLoadingChat || isLoadingMessages || !isConnected}
      />
    </div>
  );
};


import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { useSocketConnection } from '../../../hooks/chat/use_socket_connection';
import { useChatMessages } from '../../../hooks/chat/use_chat_messages';
import { chatService } from '../../../services/api/chat_service';
import { AdminChatBody } from '../admin/admin_chat_body';
import { AdminChatInput } from '../admin/admin_chat_input';
import { ConnectionStatus } from '../common/connection_status';
import { ErrorMessage } from '../../common/ui/error_message';
import type { ReservationResponse } from '../../../types/reservations/reservation';
import { useState, useCallback } from 'react';
import { chatSocketService } from '../../../services/socket/chat_socket_service';
import type { Chat } from '../../../types/chat/chat';

interface UserReservationChatViewProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
}

/**
 * User Reservation Chat View Component
 * Chat view for user-driver reservation-based chat
 * Uses contextType='reservation' and contextId=reservationId
 */
export const UserReservationChatView: React.FC<UserReservationChatViewProps> = ({
  reservationDetails,
  onBack,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.userId || '';

  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Socket connection
  const { isConnected, isConnecting, error: socketError, reconnect } = useSocketConnection();

  // Fetch chat by context
  const fetchChat = useCallback(async () => {
    setIsLoadingChat(true);
    setChatError(null);

    try {
      const response = await chatService.getChatByContext({
        contextType: 'reservation',
        contextId: reservationDetails.reservationId,
      });

      setChat(response.chat);
    } catch (err) {
      console.error('Failed to fetch reservation chat:', err);
      setChatError(err instanceof Error ? err.message : 'Failed to fetch chat');
      setChat(null);
    } finally {
      setIsLoadingChat(false);
    }
  }, [reservationDetails.reservationId]);

  // Join chat room
  const joinChat = useCallback(async () => {
    if (!chat?.chatId) {
      // Chat doesn't exist yet - it will be created when first message is sent
      return;
    }

    chatSocketService.joinChat(
      chat.chatId,
      () => {
        setIsJoined(true);
      },
      (err) => {
        console.error('Failed to join chat:', err);
        setChatError(err.message);
      }
    );
  }, [chat?.chatId]);

  // Leave chat room
  const leaveChat = useCallback(async () => {
    if (!chat?.chatId || !isJoined) return;

    chatSocketService.leaveChat(
      chat.chatId,
      () => {
        setIsJoined(false);
      },
      (err) => {
        console.error('Failed to leave chat:', err);
      }
    );
  }, [chat?.chatId, isJoined]);

  // Fetch chat on mount
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  // Join chat when available and connected
  useEffect(() => {
    if (chat?.chatId && !isJoined && isConnected) {
      joinChat();
    }
  }, [chat?.chatId, isJoined, isConnected, joinChat]);

  // Cleanup: leave chat on unmount
  useEffect(() => {
    return () => {
      if (chat?.chatId && isJoined) {
        leaveChat();
      }
    };
  }, [chat?.chatId, isJoined, leaveChat]);

  // Fetch and manage messages
  const {
    messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    sendMessage,
  } = useChatMessages({
    chatId: chat?.chatId || null,
    contextId: reservationDetails.reservationId,
    contextType: 'reservation',
    isJoined,
    onChatCreated: () => {
      // Refetch chat after first message creates it
      fetchChat();
    },
    autoFetch: true,
  });

  // Show error if chat failed to load
  if (chatError && !isLoadingChat) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                title="Back to reservation details"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Chat with Driver
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                  Reservation: {reservationDetails.reservationId}
                </p>
              </div>
            </div>
          </div>
        </div>
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
      <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
              title="Back to reservation details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Chat with Driver
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                Reservation: {reservationDetails.reservationId}
              </p>
            </div>
          </div>
        </div>
      </div>

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
        otherUserName="Driver"
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


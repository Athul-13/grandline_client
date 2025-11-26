import { Check, CheckCheck } from 'lucide-react';
import { MessageDeliveryStatus } from '../../../types/chat/message';
import type { MessageDeliveryStatusType } from '../../../types/chat/message';
import { cn } from '../../../utils/cn';

interface MessageStatusIconProps {
  status: MessageDeliveryStatusType;
  className?: string;
}

/**
 * Message Status Icon Component
 * Displays message delivery status indicators:
 * - Single tick (gray): sent
 * - Double gray tick: delivered
 * - Double blue tick: read
 */
export const MessageStatusIcon: React.FC<MessageStatusIconProps> = ({ status, className }) => {
  if (status === MessageDeliveryStatus.SENT) {
    // Single tick (gray)
    return (
      <Check
        className={cn('w-4 h-4 text-[var(--color-text-secondary)]', className)}
        strokeWidth={3}
      />
    );
  }

  if (status === MessageDeliveryStatus.DELIVERED) {
    // Double gray tick
    return (
      <div className={cn('flex items-center', className)}>
        <CheckCheck className="w-4 h-4 text-[var(--color-text-secondary)]" strokeWidth={3} />
      </div>
    );
  }

  if (status === MessageDeliveryStatus.READ) {
    // Double blue tick
    return (
      <div className={cn('flex items-center', className)}>
        <CheckCheck className="w-4 h-4 text-blue-500" strokeWidth={3} />
      </div>
    );
  }

  return null;
};


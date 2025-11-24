import { WifiOff, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  onReconnect?: () => void;
  className?: string;
}

/**
 * Connection Status Component
 * Shows socket connection status with indicator and reconnect button
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error,
  onReconnect,
  className,
}) => {
  if (isConnected && !error) {
    return null; // Don't show anything when connected
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-xs',
        'bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800',
        error && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        className
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-600 dark:text-yellow-400">Connecting...</span>
        </>
      ) : error ? (
        <>
          <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="flex-1 text-red-600 dark:text-red-400">
            Connection lost. {error}
          </span>
          {onReconnect && (
            <button
              onClick={onReconnect}
              className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            >
              Retry
            </button>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-600 dark:text-yellow-400">Disconnected</span>
          {onReconnect && (
            <button
              onClick={onReconnect}
              className="px-2 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors"
            >
              Reconnect
            </button>
          )}
        </>
      )}
    </div>
  );
};


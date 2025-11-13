import { formatDistance, formatDuration } from '../../../services/api/mapbox_directions_service';
import type { RouteResponse } from '../../../services/api/mapbox_directions_service';

interface RouteInfoBoxProps {
  route: RouteResponse | null;
  isCalculating: boolean;
  className?: string;
}

/**
 * Route Info Box Component
 * Displays total distance and time for the route
 */
export const RouteInfoBox: React.FC<RouteInfoBoxProps> = ({
  route,
  isCalculating,
  className = '',
}) => {
  // Don't show on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`absolute top-28 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px] ${className}`}
      style={{ left: '420px' }} // Right of floating sidebar (w-96 = 384px + padding)
    >
      {isCalculating ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary)]"></div>
          <span className="text-sm text-gray-600">Calculating route...</span>
        </div>
      ) : route ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Distance:</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatDistance(route.distance)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Time:</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatDuration(route.duration)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};


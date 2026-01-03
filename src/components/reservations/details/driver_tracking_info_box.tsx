/**
 * Driver Tracking Info Box Component
 * Small clickable information box that links to the full-screen tracking map
 */

import { MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface DriverTrackingInfoBoxProps {
  reservationDetails: ReservationResponse;
}

/**
 * Driver Tracking Info Box
 * Shows a small information box that users can click to view the driver tracking map
 */
export const DriverTrackingInfoBox: React.FC<DriverTrackingInfoBoxProps> = ({
  reservationDetails,
}) => {
  const navigate = useNavigate();

  // Only show if driver is assigned
  if (!reservationDetails.assignedDriverId) {
    return null;
  }

  const isTripActive =
    reservationDetails.startedAt && !reservationDetails.completedAt;

  const handleClick = () => {
    navigate(ROUTES.reservationTrackingMap(reservationDetails.reservationId));
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-all duration-200 hover:shadow-md group"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            {isTripActive ? 'Track Driver Location' : 'View Driver Location'}
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {isTripActive
              ? 'View real-time driver location on map'
              : 'View driver location and route on map'}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};


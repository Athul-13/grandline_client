/**
 * Driver Tracking Bento Card Component
 * Displays real-time driver location map for active trips
 */

import { MapPin } from 'lucide-react';
import { UserDriverTrackingMap } from '../../maps/user_driver_tracking_map';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface DriverTrackingBentoCardProps {
  reservationDetails: ReservationResponse;
}

/**
 * Driver Tracking Bento Card
 * Shows real-time driver location when trip is active
 */
export const DriverTrackingBentoCard: React.FC<DriverTrackingBentoCardProps> = ({
  reservationDetails,
}) => {
  // Only show map if trip is started but not completed
  const isTripActive =
    reservationDetails.startedAt &&
    !reservationDetails.completedAt &&
    reservationDetails.assignedDriverId;

  if (!isTripActive) {
    return null;
  }

  // Get user location from itinerary (pickup location)
  const userLocation = reservationDetails.itinerary?.find(
    (stop) => stop.stopType === 'pickup'
  );

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Live Driver Tracking
        </h3>
      </div>
      <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-[var(--color-border)]">
        <UserDriverTrackingMap
          reservationId={reservationDetails.reservationId}
          initialLocation={
            userLocation
              ? {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }
              : undefined
          }
          userLocation={
            userLocation
              ? {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }
              : undefined
          }
          className="w-full h-full"
        />
      </div>
    </div>
  );
};


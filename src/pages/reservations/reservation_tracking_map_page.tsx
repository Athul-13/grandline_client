/**
 * Reservation Tracking Map Page
 * Full-screen map view showing driver location for a reservation
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useReservationDetails } from '../../hooks/reservations/use_reservation_details';
import { UserDriverTrackingMap } from '../../components/maps/user_driver_tracking_map';
import { ReservationDetailsSkeleton } from '../../components/common/ui/loaders';
import { Button } from '../../components/common/ui/button';

/**
 * Reservation Tracking Map Page Component
 * Displays full-screen map with driver location tracking
 */
export const ReservationTrackingMapPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();

  const { reservationDetails, isLoading, error } = useReservationDetails(reservationId || '');

  // Get user location from itinerary (pickup location)
  const userLocation = reservationDetails?.itinerary?.find((stop) => stop.stopType === 'pickup');

  const handleBack = () => {
    if (reservationId) {
      navigate(`/reservations/${reservationId}`);
    } else {
      navigate('/reservations');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[var(--color-bg-primary)]">
        <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
          <ReservationDetailsSkeleton variant="user" />
        </div>
      </div>
    );
  }

  if (error || !reservationDetails) {
    return (
      <div className="flex flex-col h-screen bg-[var(--color-bg-primary)]">
        <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Tracking</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] mb-4">
              {error || 'Reservation not found'}
            </p>
            <Button onClick={handleBack}>Back to Reservations</Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if driver is assigned
  if (!reservationDetails.assignedDriverId) {
    return (
      <div className="flex flex-col h-screen bg-[var(--color-bg-primary)]">
        <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Tracking</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              No Driver Assigned
            </p>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Driver tracking will be available once a driver is assigned to your reservation.
            </p>
            <Button onClick={handleBack}>Back to Reservation Details</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Tracking</h1>
            {reservationDetails.tripName && (
              <p className="text-sm text-[var(--color-text-secondary)]">{reservationDetails.tripName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-0 relative">
        {/* Show informational message if trip hasn't started */}
        {!reservationDetails.startedAt && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--color-bg-primary)]/95 backdrop-blur-sm">
            <div className="text-center p-6 max-w-md">
              <MapPin className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Trip Not Started Yet
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Driver location tracking will be available once the driver starts the trip.
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                The map below shows your pickup location. Real-time tracking will begin when the trip starts.
              </p>
            </div>
          </div>
        )}
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


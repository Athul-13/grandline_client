import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Skeleton } from 'antd';
import { useAdminReservationDetails } from '../../hooks/reservations/use_admin_reservation_details';
import { AdminReservationDetailsView } from '../reservations/admin/admin_reservation_details_view';
import { AdminLiveTripsMap } from '../maps/admin_live_trips_map';
import { ReservationDetailsSkeleton } from '../common/ui/loaders';

interface AdminTripDetailsViewProps {
  reservationId: string;
  onBack: () => void;
}

/**
 * Admin Trip Details View Component
 * Wraps reservation details and adds live map for current trips
 */
export const AdminTripDetailsView: React.FC<AdminTripDetailsViewProps> = ({
  reservationId,
  onBack,
}) => {
  const { reservationDetails, isLoading, error, refetch } = useAdminReservationDetails(reservationId);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [tripState, setTripState] = useState<'UPCOMING' | 'CURRENT' | 'PAST' | null>(null);

  // Derive trip state from reservation
  // Note: tripStartAt/tripEndAt would need to be derived from itinerary
  // For now, we'll check if startedAt exists and completedAt doesn't to determine CURRENT state
  useEffect(() => {
    if (reservationDetails) {
      const completedAt = reservationDetails.completedAt ? new Date(reservationDetails.completedAt) : undefined;
      const startedAt = reservationDetails.startedAt ? new Date(reservationDetails.startedAt) : undefined;
      
      // Simple state derivation for now (can be enhanced with itinerary dates)
      let state: 'UPCOMING' | 'CURRENT' | 'PAST' = 'UPCOMING';
      if (completedAt) {
        state = 'PAST';
      } else if (startedAt && !completedAt) {
        state = 'CURRENT';
      }
      
      setTripState(state);
      setShowLiveMap(state === 'CURRENT' && !!reservationDetails.assignedDriverId);
    }
  }, [reservationDetails]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
        {/* Header with Back Button */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <Skeleton.Button active size="small" style={{ width: 120, height: 32 }} />
        </div>
        {/* Skeleton Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ReservationDetailsSkeleton variant="admin" />
        </div>
      </div>
    );
  }

  if (error || !reservationDetails) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Failed to load trip details'}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // For reservation details, we'll reuse the existing view but add live map section
  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header with Back Button */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Trips</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Reservation Details - Left Side */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <AdminReservationDetailsView
            reservationDetails={reservationDetails}
            isUpdatingStatus={false}
            onBack={onBack}
            onStatusChange={async () => {
              // Status changes handled by reservation view
              await refetch();
            }}
            onRefetch={refetch}
            renderHeader={false}
          />
        </div>

        {/* Live Map - Right Side (only for CURRENT trips) */}
        {showLiveMap && tripState === 'CURRENT' && reservationDetails.assignedDriverId && (
          <div className="lg:w-1/2 lg:border-l border-[var(--color-border)] flex flex-col">
            <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-lg font-semibold">Live Trip Map</h2>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Real-time driver location tracking
              </p>
            </div>
            <div className="flex-1 min-h-0 relative">
              <AdminLiveTripsMap className="w-full h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


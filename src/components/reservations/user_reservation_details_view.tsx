import { useReservationVehicles } from '../../hooks/reservations/use_reservation_vehicles';
import { useReservationAmenities } from '../../hooks/reservations/use_reservation_amenities';
import { UserReservationDetailsHeader } from './user_reservation_details_header';
import { BasicInfoBentoCard } from './details/basic_info_bento_card';
import { ItineraryBentoCard } from './details/itinerary_bento_card';
import { VehiclesBentoCard } from './details/vehicles_bento_card';
import { AmenitiesBentoCard } from './details/amenities_bento_card';
import { DriverDetailsBentoCard } from './details/driver_details_bento_card';
import type { ReservationResponse } from '../../types/reservations/reservation';

interface UserReservationDetailsViewProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
}

/**
 * User Reservation Details View Component
 * Main container for displaying reservation details with bento-style layout
 * Note: Pricing is not shown as per requirements
 */
export const UserReservationDetailsView: React.FC<UserReservationDetailsViewProps> = ({
  reservationDetails,
  onBack,
}) => {
  const { vehicles, isLoading: isLoadingVehicles } = useReservationVehicles(
    reservationDetails.selectedVehicles
  );
  const { amenities, isLoading: isLoadingAmenities } = useReservationAmenities(
    reservationDetails.selectedAmenities
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with Trip Name and Back Button */}
      <UserReservationDetailsHeader
        reservationDetails={reservationDetails}
        onBack={onBack}
      />

      {/* Content Area with Two Column Layout */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Left Column: Basic Info, Driver Info, Itinerary, Amenities */}
          <div className="flex flex-col gap-4">
            {/* Basic Info */}
            <div>
              <BasicInfoBentoCard reservationDetails={reservationDetails} />
            </div>

            {/* Driver Info - Placeholder for now */}
            {reservationDetails.assignedDriverId && (
              <div>
                <DriverDetailsBentoCard reservationDetails={reservationDetails} />
              </div>
            )}

            {/* Itinerary - Scrollable */}
            <div className="min-h-[250px] max-h-[400px] overflow-hidden">
              <ItineraryBentoCard reservationDetails={reservationDetails} />
            </div>

            {/* Amenities - Scrollable */}
            {reservationDetails.selectedAmenities && reservationDetails.selectedAmenities.length > 0 && (
              <div className="min-h-[150px] max-h-[300px] overflow-hidden">
                <AmenitiesBentoCard
                  reservationDetails={reservationDetails}
                  amenities={amenities}
                  isLoading={isLoadingAmenities}
                />
              </div>
            )}
          </div>

          {/* Right Column: Vehicles */}
          <div className="flex flex-col gap-4">
            {/* Vehicles - Scrollable */}
            {reservationDetails.selectedVehicles && reservationDetails.selectedVehicles.length > 0 && (
              <div className="min-h-[150px] max-h-[250px] overflow-hidden">
                <VehiclesBentoCard
                  reservationDetails={reservationDetails}
                  vehicles={vehicles}
                  isLoading={isLoadingVehicles}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


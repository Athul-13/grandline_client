import { useQuoteVehicles } from '../../hooks/quotes/use_quote_vehicles';
import { useQuoteAmenities } from '../../hooks/quotes/use_quote_amenities';
import { UserQuoteDetailsHeader } from './user_quote_details_header';
import { BasicInfoBentoCard } from './details/bento/basic_info_bento_card';
import { PassengersBentoCard } from './details/bento/passengers_bento_card';
import { ItineraryBentoCard } from './details/bento/itinerary_bento_card';
import { VehiclesBentoCard } from './details/bento/vehicles_bento_card';
import { AmenitiesBentoCard } from './details/bento/amenities_bento_card';
import { PricingBentoCard } from './details/bento/pricing_bento_card';
import { RouteBentoCard } from './details/bento/route_bento_card';
import type { QuoteResponse } from '../../types/quotes/quote';

interface UserQuoteDetailsViewProps {
  quoteDetails: QuoteResponse;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * User Quote Details View Component
 * Main container for displaying quote details with bento-style layout
 */
export const UserQuoteDetailsView: React.FC<UserQuoteDetailsViewProps> = ({
  quoteDetails,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { vehicles, isLoading: isLoadingVehicles } = useQuoteVehicles(quoteDetails.selectedVehicles);
  const { amenities, isLoading: isLoadingAmenities } = useQuoteAmenities(quoteDetails.selectedAmenities);

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with Trip Name and Actions */}
      <UserQuoteDetailsHeader
        quoteDetails={quoteDetails}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Scrollable Content Area with Bento Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-5 gap-4 items-start auto-rows-min">
          {/* Basic Info - Col 1, Row 1, 1 row span */}
          <div className="md:col-start-1 md:row-start-1">
            <BasicInfoBentoCard quoteDetails={quoteDetails} />
          </div>

          {/* Itinerary - Col 1, Row 2, 1 row span (right below Basic Info) */}
          <div className="md:col-start-1 md:row-start-2 -mt-20">
            <ItineraryBentoCard quoteDetails={quoteDetails} />
          </div>

          {/* Amenities - Col 1, Row 3, 1 row span (below Itinerary) */}
          <div className="md:col-start-1 md:row-start-3 -mt-4">
            <AmenitiesBentoCard
              quoteDetails={quoteDetails}
              amenities={amenities}
              isLoading={isLoadingAmenities}
            />
          </div>
          
          {/* Passengers - Col 2, Row 1, 3 row span (tall, scrollable, spans Basic Info + Itinerary + Amenity) */}
          <div className="md:col-start-2 md:row-start-1 md:row-span-3">
            <PassengersBentoCard quoteDetails={quoteDetails} />
          </div>



          {/* Pricing - Col 1, Row 4, 2 row span (spans 2 rows on left) */}
          <div className="md:col-start-1 md:row-start-4 md:row-span-2">
            <PricingBentoCard quoteDetails={quoteDetails} />
          </div>

          {/* Vehicles - Col 2, Row 4, 1 row span (top right box) */}
          <div className="md:col-start-2 md:row-start-4">
            <VehiclesBentoCard
              quoteDetails={quoteDetails}
              vehicles={vehicles}
              isLoading={isLoadingVehicles}
            />
          </div>

          {/* Route - Col 2, Row 5, 1 row span (bottom right box) */}
          <div className="md:col-start-2 md:row-start-5 -mt-5">
            <RouteBentoCard quoteDetails={quoteDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};


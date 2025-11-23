import { Check, Users, Sparkles } from 'lucide-react';
import { Button } from '../../../../components/common/ui/button';
import type { VehicleRecommendationOption } from '../../../../types/quotes/vehicle_recommendation';
import { cn } from '../../../../utils/cn';

interface VehicleCardProps {
  recommendation: VehicleRecommendationOption;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect?: () => void;
}

/**
 * Vehicle Card Component
 * Displays a vehicle recommendation option as a card
 */
export const VehicleCard: React.FC<VehicleCardProps> = ({
  recommendation,
  isSelected,
  onSelect,
  onDeselect,
}) => {
  const handleClick = () => {
    if (isSelected) {
      // If already selected, deselect it
      if (onDeselect) {
        onDeselect();
      }
    } else {
      // If not selected, select it
      onSelect();
    }
  };

  // Format price as currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get vehicle names list
  const vehicleNames = recommendation.vehicles
    .map((v) => `${v.name}${v.quantity > 1 ? ` (x${v.quantity})` : ''}`)
    .join(', ');

  return (
    <div
      className={cn(
        'bg-[var(--color-bg-secondary)] rounded-lg p-4 border-2 transition-all cursor-pointer',
        isSelected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-md'
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
              {vehicleNames}
            </h4>
            {recommendation.isExactMatch && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex-shrink-0">
                <Sparkles className="w-3 h-3" />
                Exact Match
              </span>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="flex-shrink-0 ml-2">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-2 mb-3">
        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Users className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span>
            Capacity: <span className="font-semibold text-[var(--color-text-primary)]">{recommendation.totalCapacity}</span> passengers
          </span>
        </div>

        {/* Vehicles breakdown */}
        <div className="text-xs text-[var(--color-text-secondary)] pl-6">
          {recommendation.vehicles.map((vehicle, index) => (
            <div key={vehicle.vehicleId} className="truncate">
              {index > 0 && ' • '}
              <span className="font-medium">{vehicle.name}</span>
              {vehicle.quantity > 1 && ` (${vehicle.quantity}x)`}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <div className="flex flex-col">
          <span className="text-xs text-[var(--color-text-secondary)]">Estimated Price</span>
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(recommendation.estimatedPrice)}
          </span>
        </div>
        {!isSelected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Select
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onDeselect) {
                onDeselect();
              }
            }}
          >
            Selected
          </Button>
        )}
      </div>
    </div>
  );
};


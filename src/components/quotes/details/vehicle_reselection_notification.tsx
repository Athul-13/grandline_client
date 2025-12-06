import { AlertCircle, Edit } from 'lucide-react';
import { Button } from '../../common/ui/button';
import type { QuoteResponse } from '../../../types/quotes/quote';
import { QuoteStatus } from '../../../types/quotes/quote';

interface VehicleReselectionNotificationProps {
  quoteDetails: QuoteResponse;
  onEdit?: () => void;
  show?: boolean; // Optional prop to control visibility
}

/**
 * Vehicle Reselection Notification Component
 * Displays notification when vehicles need to be reselected
 */
export const VehicleReselectionNotification: React.FC<VehicleReselectionNotificationProps> = ({
  quoteDetails,
  onEdit,
  show = false, // Default to hidden, can be controlled by parent or future backend field
}) => {
  // Only show for QUOTED status quotes when explicitly requested
  // In the future, this could be controlled by a field in quoteDetails
  // like `quoteDetails.requiresVehicleReselection`
  
  if (!show || quoteDetails.status !== QuoteStatus.QUOTED) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Vehicle Reselection Required
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            The selected vehicles are no longer available. Please select new vehicles to proceed with your quote.
          </p>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/30"
            >
              <Edit className="w-4 h-4" />
              Select New Vehicles
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Route Calculation Spinner Component
 * Shows loading spinner on map while calculating route
 */
export const RouteSpinner: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white/90 rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
      <span className="text-sm font-medium text-gray-700">Calculating route...</span>
    </div>
  );
};


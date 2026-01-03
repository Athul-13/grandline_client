import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, MapPin, ArrowRight } from 'lucide-react';
import type { AdminTripListItem } from '../../types/trips/admin_trip';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/quote_formatters';
import { highlightSearchTerm } from '../../utils/highlight_search';

interface AdminTripCardProps {
  trip: AdminTripListItem;
  searchQuery?: string;
}

/**
 * Get status badge styling based on trip state
 */
const getStatusBadgeClass = (state: string): string => {
  const stateLower = state.toLowerCase();
  if (stateLower === 'upcoming') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
  if (stateLower === 'current') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }
  if (stateLower === 'past') {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
};

/**
 * Format trip state for display
 */
const formatTripState = (state: string): string => {
  return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
};

/**
 * Admin Trip Card Component
 * Displays trip information in card format
 */
export const AdminTripCard: React.FC<AdminTripCardProps> = ({ trip, searchQuery = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/admin/trip-management/${trip.reservationId}`);
  };

  const startDate = new Date(trip.tripStartAt);
  const endDate = new Date(trip.tripEndAt);

  return (
    <div
      className={cn(
        'w-full bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]',
        'hover:shadow-md transition-all cursor-pointer',
        'flex flex-col'
      )}
      onClick={handleCardClick}
    >
      {/* Header with Status Badge */}
      <div className="p-3 pb-2 border-b border-[var(--color-border)]">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-semibold text-sm text-[var(--color-text-primary)] flex-1 line-clamp-1">
            {trip.tripName ? highlightSearchTerm(trip.tripName, searchQuery) : 'Untitled Trip'}
          </h3>
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ml-2',
              getStatusBadgeClass(trip.derivedTripState)
            )}
          >
            {formatTripState(trip.derivedTripState)}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] font-mono">
          {highlightSearchTerm(trip.reservationId, searchQuery)}
        </p>
      </div>

      {/* Trip Details */}
      <div className="p-3 space-y-2.5 flex-1">
        {/* Date Range */}
        <div className="flex items-start gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--color-text-secondary)]">Trip Date</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)]">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-start gap-2">
          <User className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--color-text-secondary)]">User</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
              {highlightSearchTerm(trip.userName, searchQuery)}
            </p>
          </div>
        </div>

        {/* Driver */}
        {trip.driverName && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--color-text-secondary)]">Driver</p>
              <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                {trip.driverName ? highlightSearchTerm(trip.driverName, searchQuery) : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with CTA */}
      <div className="p-3 pt-2 border-t border-[var(--color-border)]">
        <button
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium',
            'text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)] rounded-md transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


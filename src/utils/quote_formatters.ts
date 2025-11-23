import { StopType } from '../types/quotes/itinerary';

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time to readable string
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format price to Indian Rupee format
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || typeof price !== 'number') return '-';
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format duration (hours) to readable string
 */
export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h} hr${h !== 1 ? 's' : ''}`;
  return `${h} hr${h !== 1 ? 's' : ''} ${m} min${m !== 1 ? 's' : ''}`;
};

/**
 * Format distance (km) to readable string
 */
export const formatDistance = (km: number): string => {
  return `${km.toFixed(2)} km`;
};

/**
 * Get trip type label
 */
export const getTripTypeLabel = (tripType: string): string => {
  return tripType === 'one_way' ? 'One Way' : 'Two Way';
};

/**
 * Get stop type label
 */
export const getStopTypeLabel = (stopType: string): string => {
  switch (stopType) {
    case StopType.PICKUP:
      return 'Pickup';
    case StopType.STOP:
      return 'Stop';
    case StopType.DROPOFF:
      return 'Dropoff';
    default:
      return stopType;
  }
};


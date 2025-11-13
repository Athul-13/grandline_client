import type { ItineraryStopDto } from '../types/quotes/itinerary';
import { StopType } from '../types/quotes/itinerary';

/**
 * Stop Utility Functions
 * Shared utilities for creating and managing itinerary stops
 */

/**
 * Create a new intermediate stop
 */
export const createNewStop = (): ItineraryStopDto => {
  return {
    locationName: '',
    latitude: 0,
    longitude: 0,
    arrivalTime: '', // Empty string instead of default date
    departureTime: null,
    isDriverStaying: false,
    stayingDuration: null,
    stopType: StopType.STOP,
  };
};

/**
 * Create a new pickup stop
 */
export const createPickupStop = (
  locationName: string,
  latitude: number,
  longitude: number,
  arrivalTime?: string
): ItineraryStopDto => {
  return {
    locationName,
    latitude,
    longitude,
    arrivalTime: arrivalTime || '', // Empty string instead of default date
    departureTime: null,
    isDriverStaying: false,
    stayingDuration: null,
    stopType: StopType.PICKUP,
  };
};

/**
 * Create a new dropoff stop
 */
export const createDropoffStop = (
  locationName: string,
  latitude: number,
  longitude: number,
  arrivalTime?: string
): ItineraryStopDto => {
  return {
    locationName,
    latitude,
    longitude,
    arrivalTime: arrivalTime || '', // Empty string instead of default date
    departureTime: null,
    isDriverStaying: false,
    stayingDuration: null,
    stopType: StopType.DROPOFF,
  };
};

/**
 * Validate stops have minimum required (pickup + dropoff)
 */
export const validateStops = (stops: ItineraryStopDto[]): boolean => {
  const hasPickup = stops.some((s) => s.stopType === StopType.PICKUP);
  const hasDropoff = stops.some((s) => s.stopType === StopType.DROPOFF);
  return hasPickup && hasDropoff && stops.length >= 2;
};

/**
 * Get valid stops (with coordinates)
 */
export const getValidStops = (stops: ItineraryStopDto[]): ItineraryStopDto[] => {
  return stops.filter((stop) => stop.latitude !== 0 && stop.longitude !== 0);
};


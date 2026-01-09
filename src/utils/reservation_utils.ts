import type { ReservationResponse } from '../types/reservations/reservation';

/**
 * Calculate trip date from reservation itinerary
 * Trip date is the first pickup stop's arrival time from the outbound journey
 * This matches the server-side calculation logic
 */
export const getTripDateFromReservation = (reservation: ReservationResponse): Date | null => {
  if (!reservation.itinerary || reservation.itinerary.length === 0) {
    return null;
  }

  // Filter stops by outbound trip type and sort by stop order
  const outboundStops = reservation.itinerary
    .filter((stop) => stop.tripType === 'outbound')
    .sort((a, b) => a.stopOrder - b.stopOrder);

  // Find the first pickup stop
  const pickupStop = outboundStops.find((stop) => stop.stopType === 'pickup');

  if (!pickupStop || !pickupStop.arrivalTime) {
    return null;
  }

  return new Date(pickupStop.arrivalTime);
};

/**
 * Check if trip date is at least N days in the future
 */
export const isTripAtLeastNDaysAway = (tripDate: Date, days: number): boolean => {
  const now = new Date();
  const diffTime = tripDate.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= days;
};

/**
 * Check if reservation can be cancelled by user
 * Conditions:
 * - Status must be 'confirmed' or 'modified'
 * - Trip date must be at least 3 days in the future
 */
export const canUserCancelReservation = (reservation: ReservationResponse): boolean => {
  // Check status
  const validStatuses = ['confirmed', 'modified'];
  if (!validStatuses.includes(reservation.status)) {
    return false;
  }

  // Check trip date
  const tripDate = getTripDateFromReservation(reservation);
  if (!tripDate) {
    return false;
  }

  return isTripAtLeastNDaysAway(tripDate, 3);
};


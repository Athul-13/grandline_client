/**
 * Passenger Types
 * Types for passenger information
 */

/**
 * Passenger DTO
 * Matches backend PassengerDto
 */
export interface PassengerDto {
  fullName: string;
  phoneNumber: string;
  age: number;
}

/**
 * Passenger (with ID for UI management)
 */
export interface Passenger extends PassengerDto {
  id?: string; // Temporary ID for UI (not sent to backend)
}


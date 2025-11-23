/**
 * Utility functions for formatting vehicle plate numbers
 */

/**
 * Format plate number with spacing for display
 * Format: 2-3 letters, space, 1-2 digits, space, 2-3 letters, space, 3-4 digits
 * Example: "KL 07 CE 6987"
 */
export const formatPlateNumber = (value: string): string => {
  // Remove all spaces and dashes, convert to uppercase
  const cleaned = value.replace(/[\s-]/g, '').toUpperCase();

  // Add spacing based on length
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 10)}`;
};

/**
 * Remove spaces from plate number for API submission
 */
export const cleanPlateNumber = (value: string): string => {
  return value.replace(/[\s-]/g, '').toUpperCase();
};


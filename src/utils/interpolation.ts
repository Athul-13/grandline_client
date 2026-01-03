/**
 * Interpolation Utilities
 * Provides smooth animation functions for marker movement and rotation
 */

/**
 * Linear interpolation between two values
 * @param start Starting value
 * @param end Ending value
 * @param t Progress (0 to 1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Angle interpolation with 360° wrap handling
 * Takes the shortest path between two angles
 * @param start Starting angle in degrees (0-360)
 * @param end Ending angle in degrees (0-360)
 * @param t Progress (0 to 1)
 * @returns Interpolated angle in degrees
 */
export function lerpAngle(start: number, end: number, t: number): number {
  // Normalize angles to 0-360
  start = ((start % 360) + 360) % 360;
  end = ((end % 360) + 360) % 360;

  // Calculate shortest path
  let diff = end - start;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return start + diff * t;
}

/**
 * Ease-out cubic easing function
 * Provides natural deceleration
 * @param t Progress (0 to 1)
 * @returns Eased progress (0 to 1)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease-in-out quadratic easing function
 * Smooth acceleration and deceleration
 * @param t Progress (0 to 1)
 * @returns Eased progress (0 to 1)
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Calculate distance between two lat/lng points in kilometers
 * Uses Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


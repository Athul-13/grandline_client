/**
 * Trip utility functions
 */

/**
 * Derives trip state based on reservation data
 */
export function deriveTripState(args: {
  completedAt?: Date | string;
  startedAt?: Date | string;
  tripStartAt: Date;
  tripEndAt: Date;
  now: Date;
}): 'UPCOMING' | 'CURRENT' | 'PAST' {
  const completedAt = args.completedAt ? new Date(args.completedAt) : undefined;
  const startedAt = args.startedAt ? new Date(args.startedAt) : undefined;
  const tripStartAt = new Date(args.tripStartAt);
  const tripEndAt = new Date(args.tripEndAt);

  // Priority 1: Explicit lifecycle (completedAt) → PAST
  if (completedAt) return 'PAST';

  // Priority 2: Explicit lifecycle (startedAt && !completedAt) → CURRENT
  if (startedAt && !completedAt) return 'CURRENT';

  // Priority 3: Time-based logic
  if (tripStartAt > args.now) return 'UPCOMING';

  // Priority 4: Legacy expired (completedAt == null && tripEndAt < now) → PAST
  if (!completedAt && tripEndAt < args.now) return 'PAST';

  // Default: CURRENT (trip has started but not completed, or is currently active)
  return 'CURRENT';
}


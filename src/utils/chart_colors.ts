/**
 * Chart Color Theme Utility
 * Provides color palette for charts that matches the design system
 * Uses CSS variables for theme support (dark/light mode)
 */

/**
 * Chart color palette using CSS variables
 * Note: For SVG charts (Recharts), we use actual color values, not CSS variables
 * CSS variables don't work in SVG elements
 */
export const chartColors = {
  // Primary colors - using actual HSL value for SVG compatibility
  primary: 'hsl(217, 91%, 60%)',      // Blue - matches info color
  
  // Status colors
  success: 'hsl(142, 71%, 45%)',      // Green for positive metrics
  warning: 'hsl(38, 92%, 50%)',       // Orange for warnings
  danger: 'hsl(0, 84%, 60%)',        // Red for critical
  info: 'hsl(217, 91%, 60%)',         // Blue for info
  
  // Background colors
  bgCard: 'var(--color-bg-card)',
  bgSecondary: 'var(--color-bg-secondary)',
  border: 'var(--color-border)',
  
  // Text colors
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  
  // Chart specific colors
  active: 'hsl(142, 71%, 45%)',       // Active status
  inactive: 'hsl(38, 92%, 50%)',     // Inactive status
  blocked: 'hsl(0, 84%, 60%)',       // Blocked status
  verified: 'hsl(142, 71%, 45%)',     // Verified
  unverified: 'hsl(38, 92%, 50%)',   // Unverified
  
  // Gradient definitions for area charts
  gradient1: {
    start: 'hsl(217, 91%, 60%)',
    end: 'hsl(217, 91%, 40%)',
  },
  gradient2: {
    start: 'hsl(142, 71%, 45%)',
    end: 'hsl(142, 71%, 35%)',
  },
  gradient3: {
    start: 'hsl(38, 92%, 50%)',
    end: 'hsl(38, 92%, 40%)',
  },
} as const;

/**
 * Get gradient URL for Recharts
 * @param id - Unique gradient ID
 * @param startColor - Start color (HSL format)
 * @param endColor - End color (HSL format)
 * @returns Gradient ID string
 */
export const getGradientId = (id: string): string => `gradient-${id}`;

/**
 * Chart color array for pie/bar charts with multiple series
 */
export const chartColorArray = [
  chartColors.active,
  chartColors.inactive,
  chartColors.blocked,
  chartColors.info,
  chartColors.warning,
  chartColors.danger,
];

/**
 * Get color by index (for multiple series)
 */
export const getColorByIndex = (index: number): string => {
  return chartColorArray[index % chartColorArray.length];
};


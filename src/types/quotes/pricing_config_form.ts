import { z } from 'zod';

/**
 * Zod schema for pricing config form validation
 */
export const pricingConfigFormSchema = z.object({
  fuelPrice: z
    .string()
    .min(1, 'Fuel price is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Fuel price cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && num >= 0;
    }, 'Fuel price must be a valid number greater than or equal to 0'),
  averageDriverPerHourRate: z
    .string()
    .min(1, 'Driver rate is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Driver rate cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && num >= 0;
    }, 'Driver rate must be a valid number greater than or equal to 0'),
  taxPercentage: z
    .string()
    .min(1, 'Tax percentage is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Tax percentage cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && num >= 0;
    }, 'Tax percentage must be a valid number greater than or equal to 0')
    .refine((val) => {
      const num = Number(val.trim());
      return num <= 100;
    }, 'Tax percentage must be between 0 and 100'),
  nightChargePerNight: z
    .string()
    .min(1, 'Night charge is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Night charge cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && num >= 0;
    }, 'Night charge must be a valid number greater than or equal to 0'),
});

export type PricingConfigFormData = z.infer<typeof pricingConfigFormSchema>;


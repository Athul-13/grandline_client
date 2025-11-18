import { z } from 'zod';

/**
 * Zod schema for vehicle type form validation
 */
export const vehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .refine((val) => val.trim().replace(/\s/g, '').length > 0, {
      message: 'Name must contain non-whitespace characters',
    }),
  description: z.string().optional(),
});

export type VehicleTypeFormData = z.infer<typeof vehicleTypeFormSchema>;


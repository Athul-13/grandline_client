import { z } from 'zod';

/**
 * Zod schema for vehicle type form validation
 */
export const vehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Name cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 2, {
      message: 'Name must be at least 2 characters',
    })
    .refine((val) => val.trim().length <= 100, {
      message: 'Name must be at most 100 characters',
    }),
  description: z.string().optional(),
});

export type VehicleTypeFormData = z.infer<typeof vehicleTypeFormSchema>;


import { z } from 'zod';

/**
 * Zod schema for amenity form validation
 * Handles string inputs from form fields and transforms them to appropriate types
 */
export const amenityFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .refine((val) => val.trim().replace(/\s/g, '').length > 0, {
      message: 'Name must contain non-whitespace characters',
    }),
  price: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return null;
      const num = Number(val);
      if (isNaN(num)) return null;
      return num;
    })
    .refine((val) => val === null || (val >= 0 && val <= 10000), {
      message: 'Price must be between 0 and 10000',
    }),
});

export type AmenityFormData = z.infer<typeof amenityFormSchema>;


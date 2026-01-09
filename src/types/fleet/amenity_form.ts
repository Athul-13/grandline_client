import { z } from 'zod';

/**
 * Zod schema for amenity form validation
 * Handles string inputs from form fields and transforms them to appropriate types
 */
export const amenityFormSchema = z.object({
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

// Input type: what the form provides (before transform)
export type AmenityFormInput = z.input<typeof amenityFormSchema>;
// Output type: what the schema produces (after transform)
export type AmenityFormData = z.output<typeof amenityFormSchema>;


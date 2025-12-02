import { z } from 'zod';

/**
 * Zod schema for create driver form validation
 */
export const createDriverFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Full name cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 2, {
      message: 'Full name must be at least 2 characters',
    })
    .refine((val) => val.trim().length <= 100, {
      message: 'Full name must be at most 100 characters',
    }),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: 'Phone number must be exactly 10 digits',
    }),
  licenseNumber: z
    .string()
    .min(1, 'License number is required')
    .refine((val) => val.trim().length > 0, {
      message: 'License number cannot be empty or contain only spaces',
    }),
  salary: z
    .number()
    .min(0, 'Salary must be greater than or equal to 0')
    .refine((val) => val >= 0, {
      message: 'Salary must be a valid number',
    }),
});

export type CreateDriverFormData = z.infer<typeof createDriverFormSchema>;


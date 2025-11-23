import { z } from 'zod';

/**
 * Zod schema for registration form validation
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .refine((val) => val.trim().length > 0, {
        message: 'Full name cannot be empty or contain only spaces',
      })
      .refine((val) => val.trim().length >= 3, {
        message: 'Full name must be at least 3 characters',
      }),
    email: z
      .string()
      .min(1, 'Email is required')
      .refine((val) => val.trim().length > 0, {
        message: 'Email cannot be empty or contain only spaces',
      })
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .refine((val) => val.trim().length > 0, {
        message: 'Password cannot be empty or contain only spaces',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .refine((val) => val.trim().length > 0, {
        message: 'Password confirmation cannot be empty or contain only spaces',
      }),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .refine((val) => val.trim().length > 0, {
        message: 'Phone number cannot be empty or contain only spaces',
      })
      .refine((val) => /^\d{10}$/.test(val.trim()), {
        message: 'Phone number must be exactly 10 digits',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;


import { z } from 'zod';

/**
 * Zod schema for login form validation
 */
export const loginSchema = z.object({
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
    .min(3, 'Password must be at least 3 characters'),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;


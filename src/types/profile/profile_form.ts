import { z } from 'zod';

/**
 * Zod schema for profile form validation
 */
export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Full name cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 3, {
      message: 'Full name must be at least 3 characters',
    }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  profilePicture: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;


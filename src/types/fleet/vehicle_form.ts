import { z } from 'zod';
import { VehicleStatus } from './vehicle';

/**
 * Zod schema for vehicle form validation
 * Handles string inputs from form fields and transforms them to appropriate types
 */
export const vehicleFormSchema = z.object({
  vehicleTypeId: z
    .string()
    .min(1, 'Vehicle type is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Vehicle type cannot be empty or contain only spaces',
    }),
  vehicleModel: z
    .string()
    .min(1, 'Vehicle model is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Vehicle model cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 2, {
      message: 'Vehicle model must be at least 2 characters',
    })
    .refine((val) => val.trim().length <= 100, {
      message: 'Vehicle model must be at most 100 characters',
    }),
  year: z
    .string()
    .min(1, 'Year is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Year cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && Number.isInteger(num);
    }, 'Year must be a valid number')
    .refine((val) => {
      const num = Number(val.trim());
      return num >= 1900;
    }, 'Year must be at least 1900')
    .refine((val) => {
      const num = Number(val.trim());
      return num <= new Date().getFullYear();
    }, `Year must be at most ${new Date().getFullYear()}`),
  capacity: z
    .string()
    .min(1, 'Capacity is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Capacity cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num) && Number.isInteger(num);
    }, 'Capacity must be a whole number')
    .refine((val) => {
      const num = Number(val.trim());
      return num >= 5;
    }, 'Capacity must be at least 5')
    .refine((val) => {
      const num = Number(val.trim());
      return num <= 100;
    }, 'Capacity must be at most 100'),
  baseFare: z
    .string()
    .min(1, 'Base fare is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Base fare cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num);
    }, 'Base fare must be a valid number')
    .refine((val) => {
      const num = Number(val.trim());
      return num >= 0;
    }, 'Base fare must be a positive number'),
  maintenance: z
    .string()
    .min(1, 'Maintenance cost is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Maintenance cost cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num);
    }, 'Maintenance cost must be a valid number')
    .refine((val) => {
      const num = Number(val.trim());
      return num >= 0;
    }, 'Maintenance cost must be a positive number'),
  plateNumber: z
    .string()
    .min(1, 'Plate number is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Plate number cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const cleaned = val.trim().replace(/[\s-]/g, '').toUpperCase();
      return /^[A-Z]{2,3}\d{1,2}[A-Z]{2,3}\d{3,4}$/.test(cleaned);
    }, 'Invalid plate number format (e.g., KL07CE6987)'),
  fuelConsumption: z
    .string()
    .min(1, 'Fuel consumption is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Fuel consumption cannot be empty or contain only spaces',
    })
    .refine((val) => {
      const num = Number(val.trim());
      return !isNaN(num);
    }, 'Fuel consumption must be a valid number')
    .refine((val) => {
      const num = Number(val.trim());
      return num >= 0;
    }, 'Fuel consumption must be a positive number'),
  status: z.enum([VehicleStatus.AVAILABLE, VehicleStatus.IN_SERVICE, VehicleStatus.MAINTENANCE, VehicleStatus.RETIRED], {
    required_error: 'Status is required',
  }),
  amenityIds: z.array(z.string()).default([]),
  imageUrls: z.array(z.string()).min(1, 'At least one image is required'),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;


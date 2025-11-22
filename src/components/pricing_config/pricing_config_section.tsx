import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { History } from 'lucide-react';
import { Button } from '../common/button';
import { FormInput } from '../common/form_input';
import { ConfirmationModal } from '../common/confirmation_modal';
import { useActivePricingConfig } from '../../hooks/pricing_config/use_active_pricing_config';
import { useCreatePricingConfig } from '../../hooks/pricing_config/use_create_pricing_config';
import { useActivatePricingConfig } from '../../hooks/pricing_config/use_activate_pricing_config';
import { pricingConfigFormSchema, type PricingConfigFormData } from '../../types/quotes/pricing_config_form';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';

interface PricingConfigSectionProps {
  onHistoryClick: () => void;
  onConfigCreated?: () => void; // Callback to notify parent when config is created
}

/**
 * Pricing Configuration Section Component
 * Form for creating new pricing configuration versions
 */
export const PricingConfigSection: React.FC<PricingConfigSectionProps> = ({ onHistoryClick, onConfigCreated }) => {
  const { pricingConfig, isLoading: isLoadingConfig, error: configError, refetch } = useActivePricingConfig();
  const { createPricingConfig, isLoading: isCreating } = useCreatePricingConfig();
  const { activatePricingConfig, isLoading: isActivating } = useActivatePricingConfig();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fuelPrice: '',
    averageDriverPerHourRate: '',
    taxPercentage: '',
    nightChargePerNight: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PricingConfigFormData>({
    resolver: zodResolver(pricingConfigFormSchema),
    defaultValues: {
      fuelPrice: '',
      averageDriverPerHourRate: '',
      taxPercentage: '',
      nightChargePerNight: '',
    },
    mode: 'onChange',
  });

  const watchedFuelPrice = watch('fuelPrice');
  const watchedDriverRate = watch('averageDriverPerHourRate');
  const watchedTaxPercentage = watch('taxPercentage');
  const watchedNightCharge = watch('nightChargePerNight');

  // Update form when active config is loaded or changes
  useEffect(() => {
    if (pricingConfig) {
      const fuelPrice = pricingConfig.fuelPrice.toString();
      const driverRate = pricingConfig.averageDriverPerHourRate.toString();
      const taxPercentage = pricingConfig.taxPercentage.toString();
      const nightCharge = pricingConfig.nightChargePerNight.toString();

      const newInitialValues = {
        fuelPrice,
        averageDriverPerHourRate: driverRate,
        taxPercentage,
        nightChargePerNight: nightCharge,
      };

      // Always reset form with new values to ensure it updates
      reset(newInitialValues);
      setInitialValues(newInitialValues);
    } else {
      // No active config - clear form
      reset({
        fuelPrice: '',
        averageDriverPerHourRate: '',
        taxPercentage: '',
        nightChargePerNight: '',
      });
      setInitialValues({
        fuelPrice: '',
        averageDriverPerHourRate: '',
        taxPercentage: '',
        nightChargePerNight: '',
      });
    }
  }, [pricingConfig, reset]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    // If no active config exists, any filled values are considered changes
    if (!pricingConfig) {
      return (
        watchedFuelPrice.trim() !== '' ||
        watchedDriverRate.trim() !== '' ||
        watchedTaxPercentage.trim() !== '' ||
        watchedNightCharge.trim() !== ''
      );
    }
    // If active config exists, compare with initial values
    return (
      watchedFuelPrice !== initialValues.fuelPrice ||
      watchedDriverRate !== initialValues.averageDriverPerHourRate ||
      watchedTaxPercentage !== initialValues.taxPercentage ||
      watchedNightCharge !== initialValues.nightChargePerNight
    );
  }, [watchedFuelPrice, watchedDriverRate, watchedTaxPercentage, watchedNightCharge, initialValues, pricingConfig]);

  // Handle cancel - revert to initial values
  const handleCancel = () => {
    if (pricingConfig) {
      // Revert to active config values
      reset({
        fuelPrice: initialValues.fuelPrice,
        averageDriverPerHourRate: initialValues.averageDriverPerHourRate,
        taxPercentage: initialValues.taxPercentage,
        nightChargePerNight: initialValues.nightChargePerNight,
      });
    } else {
      // No active config - clear form
      reset({
        fuelPrice: '',
        averageDriverPerHourRate: '',
        taxPercentage: '',
        nightChargePerNight: '',
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: PricingConfigFormData) => {
    try {
      const configData = {
        fuelPrice: Number(data.fuelPrice.trim()),
        averageDriverPerHourRate: Number(data.averageDriverPerHourRate.trim()),
        taxPercentage: Number(data.taxPercentage.trim()),
        nightChargePerNight: Number(data.nightChargePerNight.trim()),
      };

      // Step 1: Create the new pricing configuration
      const createdConfig = await createPricingConfig(configData);

      if (!createdConfig) {
        toast.error('Failed to create pricing configuration');
        return;
      }

      // Step 2: Immediately activate the newly created configuration
      const activatedConfig = await activatePricingConfig(createdConfig.pricingConfigId);

      if (activatedConfig) {
        toast.success('New pricing configuration created and activated successfully');
        
        // Step 3: Refetch active config to get updated values
        await refetch();
        
        // Step 4: Notify parent (history modal) that a new config was created
        if (onConfigCreated) {
          onConfigCreated();
        }
        
        setShowConfirmModal(false);
      } else {
        toast.error('Configuration created but failed to activate. Please activate it manually from history.');
        // Still refetch and notify even if activation failed
        await refetch();
        if (onConfigCreated) {
          onConfigCreated();
        }
      }
    } catch (error) {
      const sanitizedMessage = sanitizeErrorMessage(error);
      logErrorForDev(error, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  // Handle save button click - show confirmation
  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    handleSubmit(onSubmit)();
  };

  if (isLoadingConfig) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Only show error for actual errors (network, server, etc.), not "no active config"
  if (configError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-800 dark:text-red-200">{configError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Pricing Configuration
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {pricingConfig
              ? 'Manage pricing configuration settings. Changes will create a new version and activate it.'
              : 'No active pricing configuration found. Create the first pricing configuration below.'}
          </p>
        </div>
        <button
          onClick={onHistoryClick}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
          title="View pricing configuration history"
        >
          <History className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Fuel Price (₹/L)"
            type="number"
            step="0.01"
            min="0"
            {...register('fuelPrice')}
            error={errors.fuelPrice?.message}
            disabled={isCreating}
            placeholder="e.g., 95.50"
          />

          <FormInput
            label="Average Driver Rate (₹/hour)"
            type="number"
            step="0.01"
            min="0"
            {...register('averageDriverPerHourRate')}
            error={errors.averageDriverPerHourRate?.message}
            disabled={isCreating}
            placeholder="e.g., 500.00"
          />

          <FormInput
            label="Tax Percentage (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('taxPercentage')}
            error={errors.taxPercentage?.message}
            disabled={isCreating}
            placeholder="e.g., 18.0"
          />

          <FormInput
            label="Night Charge (₹/night)"
            type="number"
            step="0.01"
            min="0"
            {...register('nightChargePerNight')}
            error={errors.nightChargePerNight?.message}
            disabled={isCreating}
            placeholder="e.g., 200.00"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!hasChanges || isCreating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={!hasChanges || isCreating || isActivating}
            loading={isCreating || isActivating}
            loadingText={isCreating ? 'Creating...' : 'Activating...'}
          >
            Save
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title={pricingConfig ? 'Create New Pricing Configuration' : 'Create Pricing Configuration'}
        message={
          pricingConfig
            ? 'Create new pricing configuration version and activate it?'
            : 'Create the first pricing configuration and activate it?'
        }
        confirmText="Create & Activate"
        cancelText="Cancel"
        variant="info"
        isLoading={isCreating}
      />
    </div>
  );
};


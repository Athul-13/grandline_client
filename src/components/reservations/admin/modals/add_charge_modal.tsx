import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { FormInput } from '../../../common/forms/form_input';
import { FormSelect } from '../../../common/forms/form_select';

interface AddChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (chargeType: string, description: string, amount: number, currency?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Add Charge Modal Component
 * Allows admin to add additional charges to a reservation
 */
export const AddChargeModal: React.FC<AddChargeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isLoading = false,
}) => {
  const [chargeType, setChargeType] = useState<'additional_passenger' | 'vehicle_upgrade' | 'amenity_add' | 'late_fee' | 'other'>('other');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState('INR');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const chargeAmount = parseFloat(amount);
    if (isNaN(chargeAmount) || chargeAmount <= 0 || !description.trim()) {
      return;
    }

    await onAdd(chargeType, description.trim(), chargeAmount, currency);
    setChargeType('other');
    setDescription('');
    setAmount('');
    setCurrency('INR');
  };

  const handleClose = () => {
    setChargeType('other');
    setDescription('');
    setAmount('');
    setCurrency('INR');
    onClose();
  };

  const chargeAmount = parseFloat(amount) || 0;
  const isValid = chargeAmount > 0 && description.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Add Charge
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <FormSelect
            label="Charge Type"
            value={chargeType}
            onChange={(e) => setChargeType(e.target.value as typeof chargeType)}
            required
            options={[
              { value: 'additional_passenger', label: 'Additional Passenger' },
              { value: 'vehicle_upgrade', label: 'Vehicle Upgrade' },
              { value: 'amenity_add', label: 'Amenity Addition' },
              { value: 'late_fee', label: 'Late Fee' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <FormInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter charge description..."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              min={0}
              step="0.01"
            />
            <FormSelect
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'INR', label: 'INR' },
                { value: 'USD', label: 'USD' },
              ]}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Adding...' : 'Add Charge'}
          </Button>
        </div>
      </div>
    </div>
  );
};


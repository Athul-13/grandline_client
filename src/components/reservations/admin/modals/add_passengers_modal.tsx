import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { FormInput } from '../../../components/common/forms/form_input';

interface PassengerForm {
  fullName: string;
  phoneNumber: string;
  age: number;
}

interface AddPassengersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (passengers: PassengerForm[]) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Add Passengers Modal Component
 * Allows admin to add passengers to a reservation
 */
export const AddPassengersModal: React.FC<AddPassengersModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isLoading = false,
}) => {
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { fullName: '', phoneNumber: '', age: 0 },
  ]);

  if (!isOpen) return null;

  const handleAddPassenger = () => {
    setPassengers([...passengers, { fullName: '', phoneNumber: '', age: 0 }]);
  };

  const handleRemovePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index: number, field: keyof PassengerForm, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validPassengers = passengers.filter(
      (p) => p.fullName.trim() && p.phoneNumber.trim() && p.age > 0
    );

    if (validPassengers.length === 0) {
      return;
    }

    await onAdd(validPassengers);
    setPassengers([{ fullName: '', phoneNumber: '', age: 0 }]);
  };

  const handleClose = () => {
    setPassengers([{ fullName: '', phoneNumber: '', age: 0 }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Add Passengers
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <div key={index} className="p-4 border border-[var(--color-border)] rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                    Passenger {index + 1}
                  </h3>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="p-1 rounded hover:bg-[var(--color-bg-hover)] text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <FormInput
                  label="Full Name"
                  value={passenger.fullName}
                  onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                  required
                />
                <FormInput
                  label="Phone Number"
                  value={passenger.phoneNumber}
                  onChange={(e) => handlePassengerChange(index, 'phoneNumber', e.target.value)}
                  required
                />
                <FormInput
                  label="Age"
                  type="number"
                  value={passenger.age || ''}
                  onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                  required
                  min={0}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddPassenger}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Passenger
          </button>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || passengers.every((p) => !p.fullName.trim() || !p.phoneNumber.trim() || p.age <= 0)}
          >
            {isLoading ? 'Adding...' : 'Add Passengers'}
          </Button>
        </div>
      </div>
    </div>
  );
};


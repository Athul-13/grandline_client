import { useState, useEffect } from 'react';
import { Button } from '../../../../components/common/button';
import { FormInput } from '../../../../components/common/form_input';
import { X } from 'lucide-react';
import type { PassengerDto } from '../../../../types/quotes/passenger';

interface PassengerFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  passenger?: PassengerDto;
  onSave: (passenger: PassengerDto) => void;
}

/**
 * Passenger Form Modal
 * Handles both adding and editing passengers
 */
export const PassengerForm: React.FC<PassengerFormProps> = ({
  isOpen,
  onClose,
  mode,
  passenger,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    age?: string;
  }>({});

  // Initialize form when modal opens or passenger changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && passenger) {
        setFullName(passenger.fullName || '');
        setPhoneNumber(passenger.phoneNumber || '');
        setAge(passenger.age?.toString() || '');
      } else {
        setFullName('');
        setPhoneNumber('');
        setAge('');
      }
      setErrors({});
    }
  }, [isOpen, mode, passenger]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum <= 0) {
        newErrors.age = 'Age must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        age: parseInt(age, 10),
      });
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {mode === 'add' ? 'Add Passenger' : 'Edit Passenger'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            error={errors.fullName}
            required
          />

          <FormInput
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            error={errors.phoneNumber}
            required
          />

          <FormInput
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            error={errors.age}
            required
            min="1"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


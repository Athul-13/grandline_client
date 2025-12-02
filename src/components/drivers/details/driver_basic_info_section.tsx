import { useState, useEffect } from 'react';
import { User, Copy, Check, Mail, Phone, CreditCard, DollarSign, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../../utils/quote_formatters';
import { Button } from '../../common/ui/button';
import { useUpdateDriver } from '../../../hooks/drivers/use_update_driver';
import { cn } from '../../../utils/cn';
import type { AdminDriverDetails } from '../../../types/drivers/admin_driver';

interface DriverBasicInfoSectionProps {
  driverDetails: AdminDriverDetails;
  onUpdate?: () => void;
}

/**
 * Driver Basic Info Section Component
 * Displays driver profile picture, basic info, driver ID (with copy), and contact details
 * Supports inline editing for: fullName, email, phoneNumber, licenseNumber, salary
 */
export const DriverBasicInfoSection: React.FC<DriverBasicInfoSectionProps> = ({ driverDetails, onUpdate }) => {
  const [copiedDriverId, setCopiedDriverId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({
    fullName: driverDetails.fullName,
    email: driverDetails.email,
    phoneNumber: driverDetails.phoneNumber || '',
    licenseNumber: driverDetails.licenseNumber,
    salary: driverDetails.salary,
  });

  const updateDriverMutation = useUpdateDriver({
    driverId: driverDetails.driverId,
    onSuccess: () => {
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    },
  });

  // Sync editedFields when driverDetails changes
  useEffect(() => {
    if (!isEditing) {
      setEditedFields({
        fullName: driverDetails.fullName,
        email: driverDetails.email,
        phoneNumber: driverDetails.phoneNumber || '',
        licenseNumber: driverDetails.licenseNumber,
        salary: driverDetails.salary,
      });
    }
  }, [driverDetails, isEditing]);

  const truncateDriverId = (driverId: string): string => {
    if (driverId.length <= 16) return driverId;
    return `${driverId.slice(0, 8)}...${driverId.slice(-4)}`;
  };

  const handleCopyDriverId = async () => {
    try {
      await navigator.clipboard.writeText(driverDetails.driverId);
      setCopiedDriverId(true);
      toast.success('Driver ID copied to clipboard');
      setTimeout(() => setCopiedDriverId(false), 2000);
    } catch {
      toast.error('Failed to copy driver ID');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFields({
      fullName: driverDetails.fullName,
      email: driverDetails.email,
      phoneNumber: driverDetails.phoneNumber || '',
      licenseNumber: driverDetails.licenseNumber,
      salary: driverDetails.salary,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({
      fullName: driverDetails.fullName,
      email: driverDetails.email,
      phoneNumber: driverDetails.phoneNumber || '',
      licenseNumber: driverDetails.licenseNumber,
      salary: driverDetails.salary,
    });
  };

  const handleSave = async () => {
    const updates: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      licenseNumber?: string;
      salary?: number;
    } = {};

    if (editedFields.fullName !== driverDetails.fullName) {
      updates.fullName = editedFields.fullName;
    }
    if (editedFields.email !== driverDetails.email) {
      updates.email = editedFields.email;
    }
    if (editedFields.phoneNumber !== (driverDetails.phoneNumber || '')) {
      updates.phoneNumber = editedFields.phoneNumber || undefined;
    }
    if (editedFields.licenseNumber !== driverDetails.licenseNumber) {
      updates.licenseNumber = editedFields.licenseNumber;
    }
    if (editedFields.salary !== driverDetails.salary) {
      updates.salary = editedFields.salary;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    await updateDriverMutation.mutateAsync(updates);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Profile & Basic Information</h3>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={updateDriverMutation.isPending}
              className="flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              loading={updateDriverMutation.isPending}
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-4">
        {driverDetails.profilePictureUrl ? (
          <img
            src={driverDetails.profilePictureUrl}
            alt={driverDetails.fullName}
            className="w-32 h-32 rounded-full object-cover border-2 border-[var(--color-border)]"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center border-2 border-[var(--color-border)]">
            <span className="text-4xl font-semibold text-[var(--color-primary)]">
              {driverDetails.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="w-full space-y-3 text-sm text-center">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedFields.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFields({ ...editedFields, fullName: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-center text-lg font-semibold',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  updateDriverMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
                disabled={updateDriverMutation.isPending}
              />
            ) : (
              <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                {driverDetails.fullName}
              </h4>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium text-[var(--color-text-secondary)]">Driver ID:</span>
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-text-primary)] font-mono text-xs">
                {truncateDriverId(driverDetails.driverId)}
              </span>
              <button
                onClick={handleCopyDriverId}
                className={copiedDriverId ? 'text-green-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'}
                title="Copy driver ID"
              >
                {copiedDriverId ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Email</p>
            {isEditing ? (
              <input
                type="email"
                value={editedFields.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFields({ ...editedFields, email: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  updateDriverMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
                disabled={updateDriverMutation.isPending}
              />
            ) : (
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{driverDetails.email}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Phone Number</p>
            {isEditing ? (
              <input
                type="tel"
                value={editedFields.phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFields({ ...editedFields, phoneNumber: e.target.value })}
                placeholder="10 digits"
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  updateDriverMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
                disabled={updateDriverMutation.isPending}
              />
            ) : (
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {driverDetails.phoneNumber || '-'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">License Number</p>
            {isEditing ? (
              <input
                type="text"
                value={editedFields.licenseNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFields({ ...editedFields, licenseNumber: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  updateDriverMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
                disabled={updateDriverMutation.isPending}
              />
            ) : (
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{driverDetails.licenseNumber}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Salary (Per Hour)</p>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedFields.salary}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFields({ ...editedFields, salary: parseFloat(e.target.value) || 0 })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                  updateDriverMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
                disabled={updateDriverMutation.isPending}
              />
            ) : (
              <p className="text-sm font-medium text-[var(--color-text-primary)]">₹{driverDetails.salary.toFixed(2)}/hr</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-secondary)]">
        <div className="flex justify-between">
          <span>Created:</span>
          <span>{formatDate(driverDetails.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Updated:</span>
          <span>{formatDate(driverDetails.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};


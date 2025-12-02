import { useState } from 'react';
import { User, Copy, Check, Mail, Phone, CreditCard, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../../utils/quote_formatters';
import type { AdminDriverDetails } from '../../../types/drivers/admin_driver';

interface DriverBasicInfoSectionProps {
  driverDetails: AdminDriverDetails;
}

/**
 * Driver Basic Info Section Component
 * Displays driver profile picture, basic info, driver ID (with copy), and contact details
 */
export const DriverBasicInfoSection: React.FC<DriverBasicInfoSectionProps> = ({ driverDetails }) => {
  const [copiedDriverId, setCopiedDriverId] = useState(false);

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

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Profile & Basic Information</h3>
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
            <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              {driverDetails.fullName}
            </h4>
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
            <p className="text-xs text-[var(--color-text-secondary)]">Email</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{driverDetails.email}</p>
          </div>
        </div>
        
        {driverDetails.phoneNumber && (
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <div className="flex-1">
              <p className="text-xs text-[var(--color-text-secondary)]">Phone Number</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{driverDetails.phoneNumber}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)]">License Number</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{driverDetails.licenseNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-secondary)]">Salary (Per Hour)</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">₹{driverDetails.salary.toFixed(2)}/hr</p>
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


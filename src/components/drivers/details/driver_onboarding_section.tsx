import { useState } from 'react';
import { CheckCircle2, XCircle, Image, FileText, Download, Eye, X } from 'lucide-react';
import { DriverOnboardingBadge } from '../driver_onboarding_badge';
import type { AdminDriverDetails } from '../../../types/drivers/admin_driver';

interface DriverOnboardingSectionProps {
  driverDetails: AdminDriverDetails;
}

/**
 * Driver Onboarding Section Component
 * Displays onboarding status and photos (profile picture and license card)
 */
export const DriverOnboardingSection: React.FC<DriverOnboardingSectionProps> = ({ driverDetails }) => {
  const [viewingImage, setViewingImage] = useState<{ url: string; type: 'profile' | 'license' } | null>(null);

  const handleViewImage = (url: string, type: 'profile' | 'license') => {
    if (url) {
      setViewingImage({ url, type });
    }
  };

  const handleDownloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Onboarding Status</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Onboarding Status</p>
          <DriverOnboardingBadge isOnboarded={driverDetails.isOnboarded} />
        </div>
        
        <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <p className="text-xs text-[var(--color-text-secondary)]">Profile Picture</p>
            </div>
            {driverDetails.profilePictureUrl ? (
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-border)]">
                  <img
                    src={driverDetails.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewImage(driverDetails.profilePictureUrl, 'profile')}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                    title="View image"
                  >
                    <Eye className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                  <button
                    onClick={() => handleDownloadImage(driverDetails.profilePictureUrl, `driver-${driverDetails.driverId}-profile.jpg`)}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                    title="Download image"
                  >
                    <Download className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <XCircle className="w-4 h-4" />
                <span>Not uploaded</span>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <p className="text-xs text-[var(--color-text-secondary)]">License Card Photo</p>
            </div>
            {driverDetails.licenseCardPhotoUrl ? (
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-border)]">
                  <img
                    src={driverDetails.licenseCardPhotoUrl}
                    alt="License Card"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewImage(driverDetails.licenseCardPhotoUrl, 'license')}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                    title="View image"
                  >
                    <Eye className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                  <button
                    onClick={() => handleDownloadImage(driverDetails.licenseCardPhotoUrl, `driver-${driverDetails.driverId}-license.jpg`)}
                    className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                    title="Download image"
                  >
                    <Download className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <XCircle className="w-4 h-4" />
                <span>Not uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Image View Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={viewingImage.url}
              alt={viewingImage.type === 'profile' ? 'Profile Picture' : 'License Card'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


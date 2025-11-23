import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Button } from '../ui/button';
import { getCroppedImg } from '../../../utils/image_crop';
import { useLanguage } from '../../../hooks/use_language';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
}

/**
 * Image Crop Modal Component
 * Allows users to crop images with specified aspect ratio
 */
export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
}) => {
  const { t } = useLanguage();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageBlob);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-2xl mx-4 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('profile.myProfile.cropImage') || 'Crop Image'}
        </h2>

        <div className="relative w-full h-64 sm:h-96 mb-4 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative',
              },
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              {t('profile.myProfile.zoom') || 'Zoom'}
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-bg-secondary)] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              {t('profile.myProfile.cancel') || 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleCrop}
              loading={isProcessing}
              disabled={isProcessing}
            >
              {t('profile.myProfile.saveCrop') || 'Save Crop'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


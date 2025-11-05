import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/common/button';
import { FormInput } from '../../../components/common/form_input';
import { ImageCropModal } from '../../../components/common/image_crop_modal';
import { fetchUserProfileAsync, updateUserProfileAsync } from '../../../store/slices/profile_slice';
import { useProfilePictureUpload } from '../../../hooks/profile/use_profile_picture_upload';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../hooks/use_language';
import { Upload } from 'lucide-react';

/**
 * My Profile Form Component
 */
export const MyProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const { t } = useLanguage();
  const { uploadProfilePicture, isUploading, error: uploadError, clearError } = useProfilePictureUpload();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [pendingProfilePicture, setPendingProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store initial values for change detection
  const [initialValues, setInitialValues] = useState({
    fullName: '',
    phoneNumber: '',
    profilePicture: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfileAsync());
    }
  }, [dispatch, profile]);

  // Update form when profile is loaded and set initial values
  useEffect(() => {
    if (profile) {
      const initialFullName = profile.fullName || '';
      const initialPhoneNumber = profile.phoneNumber || '';
      const initialProfilePicture = profile.profilePicture || '';
      
      setFullName(initialFullName);
      setPhoneNumber(initialPhoneNumber);
      setPendingProfilePicture(null); // Reset pending picture
      
      setInitialValues({
        fullName: initialFullName,
        phoneNumber: initialPhoneNumber,
        profilePicture: initialProfilePicture,
      });
    } else if (user) {
      // Fallback to auth user data
      const initialFullName = user.fullName || '';
      setFullName(initialFullName);
      setInitialValues({
        fullName: initialFullName,
        phoneNumber: '',
        profilePicture: '',
      });
    }
  }, [profile, user]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    const currentProfilePicture = pendingProfilePicture || profile?.profilePicture || '';
    const initialProfilePicture = initialValues.profilePicture || '';
    
    return (
      fullName.trim() !== initialValues.fullName ||
      phoneNumber.trim() !== initialValues.phoneNumber ||
      currentProfilePicture !== initialProfilePicture
    );
  }, [fullName, phoneNumber, pendingProfilePicture, profile?.profilePicture, initialValues]);

  // Get current profile picture to display
  const currentProfilePicture = pendingProfilePicture || profile?.profilePicture || '';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.myProfile.invalidFileType') || 'Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Create preview URL and open crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    clearError();
    
    try {
      const imageUrl = await uploadProfilePicture(croppedImageBlob, 'profile-picture.jpg');
      
      if (imageUrl) {
        setPendingProfilePicture(imageUrl);
        toast.success(t('profile.myProfile.imageUploaded') || 'Profile picture uploaded successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('profile.myProfile.uploadError') || 'Failed to upload image');
    }
    
    setCropModalOpen(false);
    setSelectedImageSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !hasChanges) return;

    setIsSubmitting(true);
    try {
      const updateData: {
        fullName?: string;
        phoneNumber?: string;
        profilePicture?: string;
      } = {};

      // Only include fields that have changed
      if (fullName.trim() !== initialValues.fullName) {
        updateData.fullName = fullName.trim() || undefined;
      }
      if (phoneNumber.trim() !== initialValues.phoneNumber) {
        updateData.phoneNumber = phoneNumber.trim() || undefined;
      }
      if (pendingProfilePicture) {
        updateData.profilePicture = pendingProfilePicture;
      }

      await dispatch(updateUserProfileAsync(updateData)).unwrap();
      
      // Update initial values after successful save
      setInitialValues({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        profilePicture: pendingProfilePicture || profile?.profilePicture || '',
      });
      setPendingProfilePicture(null);
      
      toast.success(t('profile.myProfile.updateSuccess') || 'Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('profile.myProfile.updateError') || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setPendingProfilePicture(null);
    } else if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber('');
      setPendingProfilePicture(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] flex items-center justify-center">
              {currentProfilePicture ? (
                <img
                  src={currentProfilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-2xl font-semibold">
                  {fullName.charAt(0).toUpperCase() || user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isSubmitting || isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {currentProfilePicture 
                ? (t('profile.myProfile.changePicture') || 'Change Picture')
                : (t('profile.myProfile.addPicture') || 'Add Picture')
              }
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploadError && (
              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
            )}
            {isUploading && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {t('profile.myProfile.uploading') || 'Uploading...'}
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            label={t('profile.myProfile.fullName')}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={3}
            placeholder={t('profile.myProfile.fullNamePlaceholder')}
            disabled={isLoading || isSubmitting}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              {t('profile.myProfile.email')}
            </label>
            <input
              type="email"
              value={profile?.email || user?.email || ''}
              disabled
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t('profile.myProfile.emailCannotChange')}</p>
          </div>

          <FormInput
            label={t('profile.myProfile.phoneNumber')}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder={t('profile.myProfile.phoneNumberPlaceholder')}
            disabled={isLoading || isSubmitting}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleCancel}
            disabled={isLoading || isSubmitting || !hasChanges}
          >
            {t('profile.myProfile.cancel')}
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading || isSubmitting || !hasChanges}
          >
            {isSubmitting ? t('profile.myProfile.saving') : t('profile.myProfile.saveChanges')}
          </Button>
        </div>
      </form>

      {/* Crop Modal */}
      {selectedImageSrc && (
        <ImageCropModal
          imageSrc={selectedImageSrc}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setSelectedImageSrc(null);
          }}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </>
  );
};

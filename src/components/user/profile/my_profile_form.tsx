import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/common/ui/button';
import { FormInput } from '../../../components/common/forms/form_input';
import { ImageCropModal } from '../../../components/common/modals/image_crop_modal';
import { linkGoogleAsync } from '../../../store/slices/auth_slice';
import { useProfilePictureUpload } from '../../../hooks/profile/use_profile_picture_upload';
import { useProfileQuery } from '../../../hooks/profile/use_profile_query';
import { useUpdateProfileMutation } from '../../../hooks/profile/use_update_profile_mutation';
import { profileFormSchema, type ProfileFormData } from '../../../types/profile/profile_form';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../hooks/use_language';
import { Upload } from 'lucide-react';
import { sanitizeErrorMessage, logErrorForDev } from '../../../utils/error_sanitizer';

/**
 * My Profile Form Component
 */
export const MyProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  // Use TanStack Query for profile data instead of Redux
  const { data: profile, isLoading, refetch: refetchProfile } = useProfileQuery();
  // Use TanStack Query mutation for profile updates
  const updateProfile = useUpdateProfileMutation();
  const { t } = useLanguage();
  const { uploadProfilePicture, isUploading, error: uploadError, clearError } = useProfilePictureUpload();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      profilePicture: '',
    },
    mode: 'onChange',
  });

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

  const watchedFullName = watch('fullName');
  const watchedPhoneNumber = watch('phoneNumber');

  // Update form when profile is loaded and set initial values
  // Note: Profile fetching is now handled automatically by useProfileQuery
  useEffect(() => {
    if (profile) {
      const initialFullName = profile.fullName || '';
      const initialPhoneNumber = profile.phoneNumber || '';
      const initialProfilePicture = profile.profilePicture || '';
      
      reset({
        fullName: initialFullName,
        phoneNumber: initialPhoneNumber || '',
        profilePicture: initialProfilePicture,
      });
      setPendingProfilePicture(null); // Reset pending picture
      
      setInitialValues({
        fullName: initialFullName,
        phoneNumber: initialPhoneNumber,
        profilePicture: initialProfilePicture,
      });
    } else if (user) {
      // Fallback to auth user data
      const initialFullName = user.fullName || '';
      reset({
        fullName: initialFullName,
        phoneNumber: '',
        profilePicture: '',
      });
      setInitialValues({
        fullName: initialFullName,
        phoneNumber: '',
        profilePicture: '',
      });
    }
  }, [profile, user, reset]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    const currentProfilePicture = pendingProfilePicture || profile?.profilePicture || '';
    const initialProfilePicture = initialValues.profilePicture || '';
    
    return (
      (watchedFullName?.trim() || '') !== (initialValues.fullName || '') ||
      (watchedPhoneNumber?.trim() || '') !== (initialValues.phoneNumber || '') ||
      currentProfilePicture !== initialProfilePicture
    );
  }, [watchedFullName, watchedPhoneNumber, pendingProfilePicture, profile?.profilePicture, initialValues]);

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
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
    
    setCropModalOpen(false);
    setSelectedImageSrc(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    // Use mutation's isPending state instead of local isSubmitting
    if (updateProfile.isPending || !hasChanges) return;

    try {
      const updateData: {
        fullName?: string;
        phoneNumber?: string;
        profilePicture?: string;
      } = {};

      // Only include fields that have changed
      if ((data.fullName?.trim() || '') !== (initialValues.fullName || '')) {
        updateData.fullName = data.fullName?.trim() || undefined;
      }
      if ((data.phoneNumber?.trim() || '') !== (initialValues.phoneNumber || '')) {
        updateData.phoneNumber = data.phoneNumber?.trim() || undefined;
      }
      if (pendingProfilePicture) {
        updateData.profilePicture = pendingProfilePicture;
      }

      // Use TanStack Query mutation instead of Redux
      await updateProfile.mutateAsync(updateData);
      
      // Update initial values after successful save
      setInitialValues({
        fullName: data.fullName?.trim() || '',
        phoneNumber: data.phoneNumber?.trim() || '',
        profilePicture: pendingProfilePicture || profile?.profilePicture || '',
      });
      setPendingProfilePicture(null);
      
      toast.success(t('profile.myProfile.updateSuccess') || 'Profile updated successfully');
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        profilePicture: profile.profilePicture || '',
      });
      setPendingProfilePicture(null);
    } else if (user) {
      reset({
        fullName: user.fullName || '',
        phoneNumber: '',
        profilePicture: '',
      });
      setPendingProfilePicture(null);
    }
  };

  const googleLoginRef = useRef<HTMLDivElement>(null);

  const handleLinkGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error(t('profile.myProfile.linkGoogleError'));
      return;
    }

    try {
      const result = await dispatch(linkGoogleAsync(credentialResponse.credential)).unwrap();
      toast.success(result.message || t('profile.myProfile.linkGoogleSuccess'));
      // Refetch profile to get updated hasGoogleAuth value
      await refetchProfile();
    } catch (err) {
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  const handleLinkGoogleError = () => {
    toast.error(t('profile.myProfile.linkGoogleError'));
  };

  const triggerGoogleLogin = () => {
    // Programmatically click the hidden GoogleLogin button
    const googleButton = googleLoginRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                  {(watchedFullName?.charAt(0) || user?.fullName?.charAt(0) || 'U').toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || updateProfile.isPending || isUploading}
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
            {...register('fullName')}
            error={errors.fullName?.message}
            required
            minLength={3}
            placeholder={t('profile.myProfile.fullNamePlaceholder')}
            disabled={isLoading || updateProfile.isPending}
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

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                label={t('profile.myProfile.phoneNumber')}
                type="tel"
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(value);
                }}
                error={errors.phoneNumber?.message}
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder={t('profile.myProfile.phoneNumberPlaceholder')}
                disabled={isLoading || updateProfile.isPending}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base"
              />
            )}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleCancel}
            disabled={isLoading || updateProfile.isPending || !hasChanges}
          >
            {t('profile.myProfile.cancel')}
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading || updateProfile.isPending || !hasChanges}
          >
            {updateProfile.isPending ? t('profile.myProfile.saving') : t('profile.myProfile.saveChanges')}
          </Button>
        </div>
      </form>

      {/* Link Google Account Section - Outside Form */}
      <>
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]"></div>
          </div>
        </div>

        <div className="pb-4 sm:pb-6">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            {t('profile.myProfile.linkGoogle')}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {profile?.hasGoogleAuth
              ? t('profile.myProfile.linkGoogleDescriptionLinked')
              : t('profile.myProfile.linkGoogleDescription')}
          </p>
          <div className="max-w-md">
            {/* Hidden GoogleLogin component */}
            <div ref={googleLoginRef} className="hidden">
              {!(isLoading || updateProfile.isPending) && !profile?.hasGoogleAuth && (
                <GoogleLogin
                  onSuccess={handleLinkGoogleSuccess}
                  onError={handleLinkGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  locale="en"
                />
              )}
            </div>
            {/* Visible button that triggers GoogleLogin */}
            <Button
              type="button"
              variant="outline"
              onClick={triggerGoogleLogin}
              disabled={isLoading || updateProfile.isPending || profile?.hasGoogleAuth === true}
              className="w-full sm:w-auto"
            >
              {profile?.hasGoogleAuth
                ? t('profile.myProfile.linkGoogleButtonLinked')
                : t('profile.myProfile.linkGoogleButton')}
            </Button>
          </div>
        </div>
      </>

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

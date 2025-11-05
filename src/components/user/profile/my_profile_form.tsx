import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/common/button';
import { FormInput } from '../../../components/common/form_input';
import { fetchUserProfileAsync, updateUserProfileAsync } from '../../../store/slices/profile_slice';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../hooks/use_language';

/**
 * My Profile Form Component
 */
export const MyProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const { t } = useLanguage();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfileAsync());
    }
  }, [dispatch, profile]);

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
    } else if (user) {
      // Fallback to auth user data
      setFullName(user.fullName || '');
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(updateUserProfileAsync({
        fullName: fullName.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      })).unwrap();
      
      toast.success(t('profile.myProfile.updateSuccess'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('profile.myProfile.updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
    } else if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
          disabled={isLoading || isSubmitting}
        >
          {t('profile.myProfile.cancel')}
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting ? t('profile.myProfile.saving') : t('profile.myProfile.saveChanges')}
        </Button>
      </div>
    </form>
  );
};


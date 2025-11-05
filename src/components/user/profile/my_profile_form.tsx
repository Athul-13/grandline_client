import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/common/button';
import { FormInput } from '../../../components/common/form_input';
import { fetchUserProfileAsync, updateUserProfileAsync } from '../../../store/slices/profile_slice';
import toast from 'react-hot-toast';

/**
 * My Profile Form Component
 */
export const MyProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  
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
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
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
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          minLength={3}
          placeholder="Enter your full name"
          disabled={isLoading || isSubmitting}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile?.email || user?.email || ''}
            disabled
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <FormInput
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
          pattern="[0-9]{10}"
          maxLength={10}
          placeholder="Enter your phone number (10 digits)"
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
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};


import { useLanguage } from '../../../hooks/use_language';
import { MyProfileForm } from '../../../components/user/profile/my_profile_form';

/**
 * My Profile Page
 * Displays user's basic profile information
 */
export const MyProfilePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
        {t('profile.myProfile.title')}
      </h1>
      <MyProfileForm />
    </div>
  );
};


import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api/user_service';
import type { UserProfile } from '../../types/profile/user_profile';

/**
 * Custom hook to fetch user profile
 * Uses TanStack Query for automatic caching, refetching, and state management
 * const { data: profile, isLoading, error } = useProfileQuery();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (profile) return <ProfileView profile={profile} />;
 * ```
 */
export const useProfileQuery = () => {
  return useQuery<UserProfile>({
    // Query key - unique identifier for this query
    // Used for cache invalidation, refetching, etc.
    queryKey: ['profile'],

    // Query function - fetches the data
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.user;
    },
  });
};


 
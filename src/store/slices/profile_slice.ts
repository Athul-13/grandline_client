import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  UserProfile,
  UpdateProfileRequest,
} from '../../types/profile/user_profile';
import { userService } from '../../services/api/user_service';
import { updateUserProfile as updateAuthUser, logoutAsync } from './auth_slice';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

/**
 * Fetch user profile
 */
export const fetchUserProfileAsync = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      return response.user;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Failed to fetch profile');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update user profile
 * Also updates auth slice when profile is updated
 */
export const updateUserProfileAsync = createAsyncThunk(
  'profile/updateUserProfile',
  async (data: UpdateProfileRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.updateProfile(data);
      
      // Update auth slice with new profile data (fullName, email, role)
      dispatch(updateAuthUser({
        fullName: response.user.fullName,
        email: response.user.email,
        role: response.user.role,
      }));
      
      return response.user;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Failed to update profile');
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Clear profile on logout
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      });

    // Fetch Profile
    builder
      .addCase(fetchUserProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileAsync.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;


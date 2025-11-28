import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../../types/auth/user';
import { authService } from '../../services/api/auth_service';
import {
  setEncryptedItem,
  getEncryptedItem,
  removeEncryptedItem,
} from '../../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to prevent redirects during initial auth check
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;

    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Login failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
      
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Registration failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Logout failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshTokenAsync = createAsyncThunk<AuthResponse, void>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Token refresh failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Check encrypted localStorage for user data
      const user = getEncryptedItem<User>('user');
      if (!user) {
        throw new Error('No user data found');
      }

      // If user data exists, attempt to refresh the token to validate it
      // This ensures the token in httpOnly cookies is still valid
      try {
        await authService.refreshToken(); // Just validate token, don't use response
        // Refresh successful - token is valid, return the localStorage user
        return user;
      } catch (refreshError) {
        // Token refresh failed - token is expired or invalid
        // Clear localStorage and reject
        removeEncryptedItem('user');
        const errorMessage =
          (refreshError as { message?: string })?.message ||
          (refreshError instanceof Error ? refreshError.message : 'Token refresh failed');
        return rejectWithValue(errorMessage);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Authentication check failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const googleAuthAsync = createAsyncThunk(
  'auth/googleAuth',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuth(idToken);
      // Convert GoogleAuthResponse to AuthResponse-like structure for consistency
      return {
        success: true,
        user: response.user,
        message: 'Google authentication successful',
      } as AuthResponse;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Google authentication failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const setupPasswordAsync = createAsyncThunk(
  'auth/setupPassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await authService.setupPassword(password);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Failed to setup password');
      return rejectWithValue(errorMessage);
    }
  }
);

export const linkGoogleAsync = createAsyncThunk(
  'auth/linkGoogle',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.linkGoogle(idToken);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : 'Failed to link Google account');
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Update user profile data in auth slice
     */
    updateUserProfile: (state, action: PayloadAction<{ fullName: string; email: string; role: 'user' | 'admin' }>) => {
      if (state.user) {
        state.user.fullName = action.payload.fullName;
        state.user.email = action.payload.email;
        state.user.role = action.payload.role;
        // Update encrypted storage
        setEncryptedItem('user', state.user);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      setEncryptedItem('user', action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeEncryptedItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Store encrypted user data in localStorage after successful login
        setEncryptedItem('user', action.payload.user);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        // Don't set isAuthenticated = true here because user needs to verify OTP first
        // Also don't store user in localStorage until they verify
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        removeEncryptedItem('user');
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear encrypted storage even if server call fails (fallback for network errors)
        removeEncryptedItem('user');
        state.user = null;
        state.isAuthenticated = false;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.pending, () => {
        // Don't set loading state for refresh to avoid UI flicker
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        // Refresh token endpoint only validates/refreshes tokens, doesn't return user data
        // Preserve existing user data if refresh response has no user
        if (action.payload.user) {
          state.user = action.payload.user;
          setEncryptedItem('user', action.payload.user);
        }
        // If no user in response, keep existing state.user (don't clear it)
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // Refresh failed - don't update state here, let axios interceptor handle it
        state.error = null;
      });

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        // Store encrypted user data in localStorage after successful validation
        setEncryptedItem('user', action.payload);
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        removeEncryptedItem('user');
      });

    // Google Auth
    builder
      .addCase(googleAuthAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Store encrypted user data in localStorage after successful Google auth
        setEncryptedItem('user', action.payload.user);
      })
      .addCase(googleAuthAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Setup Password
    builder
      .addCase(setupPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setupPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(setupPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Link Google
    builder
      .addCase(linkGoogleAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(linkGoogleAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(linkGoogleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearAuth, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;


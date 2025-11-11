import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth_slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Profile state is now managed by TanStack Query, not Redux
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


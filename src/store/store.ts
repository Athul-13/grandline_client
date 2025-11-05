import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth_slice';
import profileReducer from './slices/profile_slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../../types/auth/user';
import type { VerifyOtpData, ResendOtpData, OtpResponse } from '../../types/auth/otp';

/**
 * Authentication Service
 */
export const authService = {

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await grandlineAxiosClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await grandlineAxiosClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await grandlineAxiosClient.post(API_ENDPOINTS.auth.logout);
  },

  checkAuth: async (): Promise<User> => {
    const response = await grandlineAxiosClient.get<User>(API_ENDPOINTS.auth.checkAuth);
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await grandlineAxiosClient.post<AuthResponse>(
      API_ENDPOINTS.auth.refreshToken
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await grandlineAxiosClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.auth.forgotPassword,
      { email } as ForgotPasswordRequest
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    const response = await grandlineAxiosClient.post<ResetPasswordResponse>(
      API_ENDPOINTS.auth.resetPassword,
      { token, newPassword } as ResetPasswordRequest
    );
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpData): Promise<OtpResponse> => {
    const response = await grandlineAxiosClient.post<OtpResponse>(
      API_ENDPOINTS.otp.verify,
      data
    );
    return response.data;
  },

  resendOtp: async (data: ResendOtpData): Promise<OtpResponse> => {
    const response = await grandlineAxiosClient.post<OtpResponse>(
      API_ENDPOINTS.otp.resend,
      data
    );
    return response.data;
  },
};


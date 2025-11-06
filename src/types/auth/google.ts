/**
 * Google Authentication Types
 */

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  user: {
    userId: string;
    fullName: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface SetupPasswordRequest {
  password: string;
}

export interface SetupPasswordResponse {
  message: string;
}

export interface LinkGoogleRequest {
  idToken: string;
}

export interface LinkGoogleResponse {
  message: string;
}


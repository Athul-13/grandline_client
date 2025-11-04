export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}


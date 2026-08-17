import { apiClient } from '../client';

export type InitLoginPayload = {
  phone: string;
  name: string;
};

export type InitLoginResponse = {
  message?: string;
  success?: boolean;
};

export type otpVerifyResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    full_name: string;
    phone: string;
  };
  access_token: string;
  refresh_token: string;
};

export type otpVerifyPayload = {
  phone: string;
  otp: string;
};

export const initLogin = async (payload: InitLoginPayload) => {
  const response = await apiClient.post<InitLoginResponse>(
    '/auth/init-login',
    payload,
  );

  return response.data;
};

export const verifyOtp = async (payload: otpVerifyPayload) => {
  const response = await apiClient.post<otpVerifyResponse>(
    '/auth/verify-otp',
    payload,
  );
  return response.data;
};

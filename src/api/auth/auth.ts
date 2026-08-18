import { getStoredAuthTokens } from '../../auth/storage';
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

export type verifyTokenResponse = {
  success: boolean;
  message: string;
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

export const renewAuthToken = async () => {
  const tokens = await getStoredAuthTokens();

  const response = await apiClient.post<otpVerifyResponse>(
    '/auth/refresh-token',
    {},
    {
      headers: {
        Authorization: 'Bearer ' + tokens.refreshToken,
      },
    },
  );
  return response.data;
};

export const verifyAuthToken = async () => {
  const response = await apiClient.post<verifyTokenResponse>(
    '/auth/verify-auth-token',
  );

  return response?.data;
};

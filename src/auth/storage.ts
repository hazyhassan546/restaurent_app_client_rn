import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const OTP_PHONE_KEY = 'otp_phone';
export const OTP_CODE_KEY = 'otp_code';

export const saveAuthTokens = async (
  authToken: string,
  refreshToken: string,
): Promise<void> => {
  await Promise.all([
    AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
  ]);
};

export const getStoredAuthTokens = async (): Promise<{
  authToken: string | null;
  refreshToken: string | null;
}> => {
  const [authToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem(AUTH_TOKEN_KEY),
    AsyncStorage.getItem(REFRESH_TOKEN_KEY),
  ]);

  return {
    authToken,
    refreshToken,
  };
};

export const saveOtpDetails = async (
  phoneNumber: string,
  otpCode: string,
): Promise<void> => {
  await Promise.all([
    AsyncStorage.setItem(OTP_PHONE_KEY, phoneNumber),
    AsyncStorage.setItem(OTP_CODE_KEY, otpCode),
  ]);
};

export const getOtpDetails = async (): Promise<{
  phoneNumber: string | null;
  otpCode: string | null;
}> => {
  const [phoneNumber, otpCode] = await Promise.all([
    AsyncStorage.getItem(OTP_PHONE_KEY),
    AsyncStorage.getItem(OTP_CODE_KEY),
  ]);

  return {
    phoneNumber,
    otpCode,
  };
};

export const clearOtpDetails = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(OTP_PHONE_KEY),
    AsyncStorage.removeItem(OTP_CODE_KEY),
  ]);
};

export const clearAuthTokens = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
  ]);
};

import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';

const DEFAULT_TIMEOUT = 15000;

const getBaseUrl = (): string => {
  const overrideUrl = (
    globalThis as { process?: { env?: { API_BASE_URL?: string } } }
  ).process?.env?.API_BASE_URL;

  //     const BASE_URL = __DEV__
  //   ? "http://192.168.1.XX:3000/api"   // your local IP
  //   : "https://your-production-api.com/api";

  if (overrideUrl) {
    return overrideUrl.replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1';
  }

  return 'http://localhost:3000/api/v1';
};

const normalizeApiError = (error: AxiosError | unknown) => {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      'Something went wrong';

    return {
      ...error,
      message,
      status: error.response?.status ?? 0,
    };
  }

  return error;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: status => status >= 200 && status < 300,
});

apiClient.interceptors.request.use(config => {
  config.headers = {
    ...(config.headers ?? {}),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  } as typeof config.headers;

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeApiError(error)),
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      'Something went wrong'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

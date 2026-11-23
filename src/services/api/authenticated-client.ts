/**
 * authenticatedClient — attaches Bearer token and handles silent token refresh.
 *
 * Token storage strategy: access token in memory (via Zustand), refresh token
 * in localStorage. This keeps the access token out of persistent storage while
 * allowing refresh across page reloads.
 */
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "@/app/config/api.config";

// We import the auth store lazily to avoid circular dependency at module load.
let _getAccessToken: (() => string | null) | null = null;
let _getRefreshToken: (() => string | null) | null = null;
let _setTokens:
  | ((access: string, refresh: string, expiresIn: number) => void)
  | null = null;
let _clearAuth: (() => void) | null = null;

export function registerAuthStore(fns: {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string, expiresIn: number) => void;
  clearAuth: () => void;
}) {
  _getAccessToken = fns.getAccessToken;
  _getRefreshToken = fns.getRefreshToken;
  _setTokens = fns.setTokens;
  _clearAuth = fns.clearAuth;
}

const BASE = `${API_CONFIG.baseURL}/api/${API_CONFIG.version}`;

export const authClient = axios.create({
  baseURL: BASE,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: attach access token ─────────────────────────────────
authClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = _getAccessToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: silent refresh on 401 ──────────────────────────────
let isRefreshing = false;
type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: FailedRequest[] = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

authClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token as string}`;
        return authClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = _getRefreshToken?.();
    if (!refreshToken) {
      _clearAuth?.();
      processQueue(error, null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      _setTokens?.(data.access_token, data.refresh_token, data.expires_in);
      processQueue(null, data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return authClient(originalRequest);
    } catch (refreshError) {
      _clearAuth?.();
      processQueue(error, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

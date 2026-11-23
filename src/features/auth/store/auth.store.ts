import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserResponse } from "@/services/generated/api-types";

const REFRESH_TOKEN_KEY = "soh_refresh_token";
const EXPIRES_AT_KEY = "soh_token_expires_at";

interface AuthState {
  // In-memory only — never persisted
  accessToken: string | null;
  // Stored via localStorage through Zustand persist
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserResponse | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (access: string, refresh: string, expiresIn: number) => void;
  setUser: (user: UserResponse) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,

      setTokens: (access, refresh, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({
          accessToken: access,
          refreshToken: refresh,
          expiresAt,
          isAuthenticated: true,
        });
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
        });
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(EXPIRES_AT_KEY);
      },

      getAccessToken: () => get().accessToken,
      getRefreshToken: () =>
        get().refreshToken ?? localStorage.getItem(REFRESH_TOKEN_KEY),
    }),
    {
      name: "soh-auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist the refresh token and user; access token stays in memory
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

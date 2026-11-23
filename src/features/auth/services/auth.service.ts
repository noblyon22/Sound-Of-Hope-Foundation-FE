import { publicClient } from "@/services/api/public-client";
import { authClient } from "@/services/api/authenticated-client";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordChangeRequest,
  EmailVerifyRequest,
  RefreshRequest,
} from "@/services/generated/api-types";

const AUTH = "/auth";

export const authService = {
  register: (data: RegisterRequest) =>
    publicClient.post<UserResponse>(`${AUTH}/register`, data).then((r) => r.data),

  login: (data: LoginRequest) =>
    publicClient.post<TokenResponse>(`${AUTH}/login`, data).then((r) => r.data),

  refresh: (data: RefreshRequest) =>
    publicClient.post<TokenResponse>(`${AUTH}/refresh`, data).then((r) => r.data),

  logout: (data: RefreshRequest) =>
    authClient.post(`${AUTH}/logout`, data),

  logoutAll: () =>
    authClient.post(`${AUTH}/logout-all`),

  me: () =>
    authClient.get<UserResponse>(`${AUTH}/me`).then((r) => r.data),

  verifyEmail: (data: EmailVerifyRequest) =>
    publicClient.post(`${AUTH}/verify-email`, data),

  resendVerification: (email: string) =>
    publicClient.post(`${AUTH}/resend-verification`, { email }),

  requestPasswordReset: (data: PasswordResetRequest) =>
    publicClient.post(`${AUTH}/password/reset`, data),

  confirmPasswordReset: (data: PasswordResetConfirm) =>
    publicClient.post(`${AUTH}/password/reset/confirm`, data),

  changePassword: (data: PasswordChangeRequest) =>
    authClient.post(`${AUTH}/password/change`, data),
};

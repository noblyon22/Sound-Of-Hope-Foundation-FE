import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { extractApiError } from "@/services/generated/api-types";
import type {
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordChangeRequest,
  EmailVerifyRequest,
} from "@/services/generated/api-types";

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};

// ── Current user ─────────────────────────────────────────────────────────────

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: authService.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (tokens) => {
      setTokens(tokens.access_token, tokens.refresh_token, tokens.expires_in);
      try {
        const user = await authService.me();
        setUser(user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
      } catch {
        // non-fatal — user will be fetched lazily
      }
      navigate("/");
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      navigate("/auth/verify-email-sent");
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const { clearAuth, getRefreshToken } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authService.logout({ refresh_token: refreshToken });
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate("/auth/login");
    },
  });
}


export function useVerifyEmail() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: EmailVerifyRequest) => authService.verifyEmail(data),
    onSuccess: () => {
      navigate("/auth/login?verified=true");
    },
  });
}

// ── Resend verification ───────────────────────────────────────────────────────

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });
}

// ── Password reset ────────────────────────────────────────────────────────────

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequest) =>
      authService.requestPasswordReset(data),
  });
}

export function useConfirmPasswordReset() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PasswordResetConfirm) =>
      authService.confirmPasswordReset(data),
    onSuccess: () => {
      navigate("/auth/login?reset=true");
    },
  });
}

// ── Change password ───────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) =>
      authService.changePassword(data),
  });
}

// Re-export helper so components don't need to import from the types package
export { extractApiError };

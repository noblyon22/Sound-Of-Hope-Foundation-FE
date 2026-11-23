import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./query-client";
import { router } from "./router";
import { Toaster } from "@/components/ui/toaster";

// Register auth store with the authenticated Axios client so it can
// silently refresh tokens without a circular import at module load time.
import { registerAuthStore } from "@/services/api/authenticated-client";
import { useAuthStore } from "@/features/auth";

const { getAccessToken, getRefreshToken, setTokens, clearAuth } =
  useAuthStore.getState();
registerAuthStore({ getAccessToken, getRefreshToken, setTokens, clearAuth });

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

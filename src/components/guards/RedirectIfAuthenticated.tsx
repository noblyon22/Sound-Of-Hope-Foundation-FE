import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

interface Props {
  children: React.ReactNode;
}

/**
 * Prevents already-authenticated users from accessing auth pages (login, register).
 */
export function RedirectIfAuthenticated({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

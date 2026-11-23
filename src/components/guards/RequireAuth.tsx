import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps a route subtree and redirects unauthenticated users to the login page.
 * The current path is preserved as a `redirect` query param so the user is
 * sent back after they sign in.
 */
export function RequireAuth({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}

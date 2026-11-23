import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  AuthLayout,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  VerifyEmailSentPage,
} from "@/features/auth";
import { RedirectIfAuthenticated } from "@/components/guards/RedirectIfAuthenticated";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  HomePage,
  NewsPage,
  NewsDetailPage,
  EventsPage,
  EventDetailPage,
  BookingPage,
  MusicianProfilePage,
  BookingCheckoutPage,
} from "@/features/public";

export const router = createBrowserRouter([
  // ── Public pages ──────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/news/:id", element: <NewsDetailPage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/events/:id", element: <EventDetailPage /> },
      { path: "/book", element: <BookingPage /> },
      { path: "/book/:id", element: <MusicianProfilePage /> },
      { path: "/book/:id/checkout", element: <BookingCheckoutPage /> },
    ],
  },

  // ── Auth routes (learner sign-in / register) ───────────────────────────────
  {
    path: "/auth",
    element: (
      <RedirectIfAuthenticated>
        <AuthLayout />
      </RedirectIfAuthenticated>
    ),
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
      { path: "verify-email-sent", element: <VerifyEmailSentPage /> },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-5xl font-bold text-muted-foreground">404</h1>
          <p className="mt-2 text-muted-foreground">Page not found.</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline text-sm">
            Go home
          </a>
        </div>
      </div>
    ),
  },
]);

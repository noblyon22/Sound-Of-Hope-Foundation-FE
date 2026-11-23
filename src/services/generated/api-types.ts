/**
 * API types derived from the backend Pydantic schemas.
 * Keep in sync with main-backend app modules.
 */

// ── Identity / Auth ──────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface UserResponse {
  id: string;
  email: string;
  is_active: boolean;
  is_email_verified: boolean;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface EmailVerifyRequest {
  token: string;
}

// ── Generic API error ────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  loc?: (string | number)[];
  msg: string;
  type?: string;
}

export interface ApiError {
  detail: string | ApiErrorDetail[];
}

export function extractApiError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: ApiError } }).response;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg).join("; ");
    }
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ── Publications ──────────────────────────────────────────────────────────────

/** Backend: article | report | newsletter | policy | research */
export type PublicationType = "article" | "report" | "newsletter" | "policy" | "research";

export interface Publication {
  id: string;
  title: string;
  publication_type: PublicationType;
  /** Short description shown in listing cards */
  summary: string | null;
  /** Full body — may be HTML or plain text */
  body?: string | null;
  published_date: string | null;
  is_published: boolean;
  is_public: boolean;
  file_key: string | null;
  created_at: string;
}

export type PaginatedPublications = PaginatedResponse<Publication>;

// ── Events ───────────────────────────────────────────────────────────────────

export type EventType = "general" | "workshop" | "concert" | "exhibition" | "community" | "training";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  location: string | null;
  is_online: boolean;
  starts_at: string;
  ends_at: string;
  max_attendees: number | null;
  is_public: boolean;
  is_published: boolean;
  created_at: string;
}

export type PaginatedEvents = PaginatedResponse<Event>;

// ── CMS Pages ────────────────────────────────────────────────────────────────

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  published_at: string | null;
  created_at: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  version_number: number;
  content_blocks: Record<string, unknown>;
  created_at: string;
}

// ── Organisation ─────────────────────────────────────────────────────────────

export interface Organisation {
  id: string;
  name: string;
  legal_name: string | null;
  tagline: string | null;
  description: string | null;
  mission: string | null;
  vision: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string;
  logo_key: string | null;
}

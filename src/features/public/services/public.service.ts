/**
 * Public API service — no authentication required.
 *
 * API paths (backend: /api/v1/...):
 *   Publications: GET /publications
 *   Events:       GET /events
 *   CMS pages:    GET /cms/pages, GET /cms/pages/{id}/versions
 *   Organisation: GET /organisation
 */
import { publicClient } from "@/services/api/public-client";
import type {
  PaginatedPublications,
  Publication,
  PaginatedEvents,
  Event,
  CmsPage,
  PageVersion,
  Organisation,
} from "@/services/generated/api-types";

// ── Publications ──────────────────────────────────────────────────────────────

export async function fetchPublications(params?: {
  page?: number;
  page_size?: number;
  publication_type?: string;
}): Promise<PaginatedPublications> {
  const { data } = await publicClient.get<PaginatedPublications>("/publications", {
    params: { page: 1, page_size: 10, is_published: true, is_public: true, ...params },
  });
  return data;
}

export async function fetchPublicationById(id: string): Promise<Publication> {
  const { data } = await publicClient.get<Publication>(`/publications/${id}`);
  return data;
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchEvents(params?: {
  page?: number;
  page_size?: number;
}): Promise<PaginatedEvents> {
  const { data } = await publicClient.get<PaginatedEvents>("/events", {
    params: { page: 1, page_size: 10, is_public: true, is_published: true, ...params },
  });
  return data;
}

export async function fetchEventById(id: string): Promise<Event> {
  const { data } = await publicClient.get<Event>(`/events/${id}`);
  return data;
}

// ── CMS pages ─────────────────────────────────────────────────────────────────

export async function fetchCmsPage(slug: string): Promise<CmsPage | null> {
  try {
    const { data } = await publicClient.get<{ items: CmsPage[]; meta: unknown }>(
      "/cms/pages",
      { params: { q: slug, status: "published", page: 1, page_size: 5 } }
    );
    return data.items.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function fetchPageVersions(pageId: string): Promise<PageVersion[]> {
  const { data } = await publicClient.get<PageVersion[]>(`/cms/pages/${pageId}/versions`);
  return data;
}

/** Fetch the latest published content for a CMS page by slug.
 *  Returns the content string from the specified block key, or null. */
export async function fetchCmsContent(
  slug: string,
  blockKey: "body" | "stats" = "body"
): Promise<string | null> {
  const page = await fetchCmsPage(slug);
  if (!page) return null;
  try {
    const versions = await fetchPageVersions(page.id);
    if (!versions.length) return null;
    const latest = versions[0];
    const blocks = latest.content_blocks as Record<string, Record<string, string>>;
    return blocks[blockKey]?.content ?? null;
  } catch {
    return null;
  }
}

// ── Organisation ──────────────────────────────────────────────────────────────

export async function fetchOrganisation(): Promise<Organisation | null> {
  try {
    const { data } = await publicClient.get<Organisation>("/organisation");
    return data;
  } catch {
    return null;
  }
}

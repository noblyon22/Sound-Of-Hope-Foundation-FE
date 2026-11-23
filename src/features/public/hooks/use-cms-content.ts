import { useQuery } from "@tanstack/react-query";
import { fetchCmsContent } from "../services/public.service";

export function useCmsContent(slug: string, blockKey: "body" | "stats" = "body") {
  return useQuery({
    queryKey: ["cms-content", slug, blockKey],
    queryFn: () => fetchCmsContent(slug, blockKey),
    // No staleTime — always re-fetch on mount so published changes appear immediately.
    // The backend response is fast and the data is small.
    staleTime: 0,
    gcTime: 0,
  });
}

import { useQuery } from "@tanstack/react-query";
import { fetchPublications, fetchPublicationById } from "../services/public.service";

export function usePublications(params?: {
  page?: number;
  page_size?: number;
  publication_type?: string;
}) {
  return useQuery({
    queryKey: ["publications", params],
    queryFn: () => fetchPublications(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublication(id: string) {
  return useQuery({
    queryKey: ["publication", id],
    queryFn: () => fetchPublicationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

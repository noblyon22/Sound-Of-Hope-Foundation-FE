import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchEventById } from "../services/public.service";

export function useEvents(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

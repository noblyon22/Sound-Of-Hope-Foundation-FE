import { useQuery } from "@tanstack/react-query";
import { fetchOrganisation } from "../services/public.service";

export function useOrganisation() {
  return useQuery({
    queryKey: ["organisation-public"],
    queryFn: fetchOrganisation,
    staleTime: 1000 * 60 * 10,
  });
}

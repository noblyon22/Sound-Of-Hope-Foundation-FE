import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min
      retry: (failureCount, error) => {
        // Don't retry 4xx errors
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          (error as { response?: { status?: number } }).response?.status &&
          ((error as { response: { status: number } }).response.status >= 400 &&
            (error as { response: { status: number } }).response.status < 500)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

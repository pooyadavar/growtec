import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 30,
      networkMode: "offlineFirst",
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: 1,
    },
  },
});

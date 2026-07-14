import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 30,
      networkMode: "offlineFirst",
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status >= 500) return failureCount < 3;
        return failureCount < 1;
      },
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: 1,
    },
  },
});

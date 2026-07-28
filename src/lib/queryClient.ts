import { QueryClient } from '@tanstack/react-query';

// Centralized query defaults. Individual features may override per-query.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
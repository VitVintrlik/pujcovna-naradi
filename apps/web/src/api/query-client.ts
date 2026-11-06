import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isClientError } from '../utils/error-message';

const MAX_QUERY_RETRIES = 3;

const logError = (error: Error) => {
  console.error(error);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: logError }),
  mutationCache: new MutationCache({ onError: logError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => failureCount < MAX_QUERY_RETRIES && !isClientError(error),
    },
  },
});

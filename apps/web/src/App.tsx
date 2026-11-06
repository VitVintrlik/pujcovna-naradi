import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { queryClient } from './api/query-client';
import { RolePreviewProvider } from './auth/RolePreviewContext';
import { router } from './routes';

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RolePreviewProvider>
      <RouterProvider router={router} />
    </RolePreviewProvider>
  </QueryClientProvider>
);

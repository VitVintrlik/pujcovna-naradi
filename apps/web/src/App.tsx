import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from './auth/RoleContext';
import { router } from './routes';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>
  </QueryClientProvider>
);

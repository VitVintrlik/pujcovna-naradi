import { UserRole } from '@pujcovna/shared';
import { createBrowserRouter } from 'react-router';
import { RequireRole } from './auth/RequireRole';
import { AppLayout } from './layouts/AppLayout';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { CreatePickupLocationPage } from './pages/CreatePickupLocationPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PickupLocationsPage } from './pages/PickupLocationsPage';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <RequireRole role={UserRole.Worker} />,
        children: [
          { path: paths.pickupLocations, element: <PickupLocationsPage /> },
          { path: paths.createPickupLocation, element: <CreatePickupLocationPage /> },
        ],
      },
      { path: paths.accessDenied, element: <AccessDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

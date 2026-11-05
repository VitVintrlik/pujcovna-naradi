import { createBrowserRouter } from 'react-router-dom';
import { RequireRole } from './auth/RequireRole';
import { UserRole } from './auth/user-role';
import { AppLayout } from './layouts/AppLayout';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { CreatePickupLocationPage } from './pages/CreatePickupLocationPage';
import { HomePage } from './pages/HomePage';
import { PickupLocationsPage } from './pages/PickupLocationsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: paths.pickupLocations,
        element: (
          <RequireRole role={UserRole.Worker}>
            <PickupLocationsPage />
          </RequireRole>
        ),
      },
      {
        path: paths.createPickupLocation,
        element: (
          <RequireRole role={UserRole.Worker}>
            <CreatePickupLocationPage />
          </RequireRole>
        ),
      },
      { path: paths.accessDenied, element: <AccessDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

import type { UserRole } from '@pujcovna/shared';
import { Button, EmptyState, ErrorState, LoadingState } from '@pujcovna/ui';
import { Navigate, Outlet } from 'react-router';
import { useCurrentRole } from '../hooks/use-current-role';
import { useCurrentUser } from '../hooks/use-current-user';
import { useSignIn } from '../hooks/use-sign-in';
import { paths } from '../paths';
import { getErrorMessage } from '../utils/error-message';

type RequireRoleProps = {
  role: UserRole;
};

export const RequireRole = ({ role }: RequireRoleProps) => {
  const currentUser = useCurrentUser();
  const currentRole = useCurrentRole();
  const signIn = useSignIn();

  if (currentUser.isPending) {
    return <LoadingState />;
  }

  if (currentUser.isError) {
    return <ErrorState message={getErrorMessage(currentUser.error)} />;
  }

  if (currentRole === undefined) {
    return (
      <EmptyState
        action={
          <Button disabled={signIn.isPending} onClick={() => signIn.mutate()}>
            Přihlásit se
          </Button>
        }
        description="Tato stránka je určena pracovníkům. Přihlaste se svým účtem."
        title="Přihlaste se"
      />
    );
  }

  if (currentRole !== role) {
    return <Navigate replace to={paths.accessDenied} />;
  }

  return <Outlet />;
};

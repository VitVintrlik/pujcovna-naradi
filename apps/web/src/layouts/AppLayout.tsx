import { AppShell } from '@pujcovna/ui';
import { Outlet } from 'react-router';
import { SiteHeader } from '../components/SiteHeader';
import { useCurrentUser } from '../hooks/use-current-user';
import { useSignIn } from '../hooks/use-sign-in';
import { useSignOut } from '../hooks/use-sign-out';

const APP_NAME = 'Půjčovna nářadí';

export const AppLayout = () => {
  const currentUser = useCurrentUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <AppShell
      footer={APP_NAME}
      header={
        <SiteHeader
          appName={APP_NAME}
          currentUser={currentUser.data}
          onSignIn={() => signIn.mutate()}
          onSignOut={() => signOut.mutate()}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
};

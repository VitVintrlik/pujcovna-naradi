import { AppShell } from '@pujcovna/ui';
import { Outlet } from 'react-router';
import { useRolePreview } from '../auth/RolePreviewContext';
import { SiteHeader } from '../components/SiteHeader';
import { useCurrentRole } from '../hooks/use-current-role';
import { useCurrentUser } from '../hooks/use-current-user';
import { useSignIn } from '../hooks/use-sign-in';
import { useSignOut } from '../hooks/use-sign-out';

const APP_NAME = 'Půjčovna nářadí';
const IS_ROLE_PREVIEW_ENABLED = import.meta.env.DEV;

export const AppLayout = () => {
  const currentUser = useCurrentUser();
  const currentRole = useCurrentRole();
  const { setRolePreview } = useRolePreview();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <AppShell
      footer={APP_NAME}
      header={
        <SiteHeader
          appName={APP_NAME}
          currentRole={currentRole}
          currentUser={currentUser.data}
          onRolePreviewChange={IS_ROLE_PREVIEW_ENABLED ? setRolePreview : undefined}
          onSignIn={() => signIn.mutate()}
          onSignOut={() => signOut.mutate()}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
};

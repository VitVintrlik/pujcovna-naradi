import { UserRole, type AuthenticatedUser } from '@pujcovna/shared';
import { Button, buttonVariants } from '@pujcovna/ui';
import { Link, NavLink } from 'react-router';
import { paths } from '../paths';
import { RolePreviewSwitch } from './RolePreviewSwitch';

type SiteHeaderProps = {
  appName: string;
  // undefined while the session is loading
  currentUser: AuthenticatedUser | null | undefined;
  currentRole: UserRole | undefined;
  onSignIn: () => void;
  onSignOut: () => void;
  onRolePreviewChange?: (role: UserRole) => void;
};

const navigationLinkClassName = buttonVariants({ variant: 'navigation' });

export const SiteHeader = ({
  appName,
  currentUser,
  currentRole,
  onSignIn,
  onSignOut,
  onRolePreviewChange,
}: SiteHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-wrap items-center gap-6">
      <Link className="text-lg font-bold tracking-tight" to={paths.home}>
        {appName}
      </Link>
      <nav aria-label="Hlavní navigace" className="flex items-center gap-1">
        <NavLink className={navigationLinkClassName} end to={paths.home}>
          Přehled
        </NavLink>
        {currentRole === UserRole.Worker && (
          <NavLink className={navigationLinkClassName} to={paths.categories}>
            Kategorie
          </NavLink>
        )}
        {currentRole === UserRole.Worker && (
          <NavLink className={navigationLinkClassName} to={paths.pickupLocations}>
            Výdejní místa
          </NavLink>
        )}
      </nav>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {onRolePreviewChange && (
        <RolePreviewSwitch currentRole={currentRole} onRoleChange={onRolePreviewChange} />
      )}
      {currentUser === null && <Button onClick={onSignIn}>Přihlásit se</Button>}
      {currentUser && (
        <>
          <span className="text-sm text-muted-foreground">{currentUser.name}</span>
          <Button onClick={onSignOut} variant="outline">
            Odhlásit se
          </Button>
        </>
      )}
    </div>
  </div>
);

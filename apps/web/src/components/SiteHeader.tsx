import { UserRole, type AuthenticatedUser } from '@pujcovna/shared';
import { Button, buttonVariants } from '@pujcovna/ui';
import { Link, NavLink } from 'react-router';
import { paths } from '../paths';

type SiteHeaderProps = {
  appName: string;
  // undefined while the session is loading
  currentUser: AuthenticatedUser | null | undefined;
  onSignIn: () => void;
  onSignOut: () => void;
};

const navigationLinkClassName = buttonVariants({ variant: 'navigation' });

export const SiteHeader = ({ appName, currentUser, onSignIn, onSignOut }: SiteHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-wrap items-center gap-6">
      <Link className="text-lg font-bold tracking-tight" to={paths.home}>
        {appName}
      </Link>
      <nav aria-label="Hlavní navigace" className="flex items-center gap-1">
        <NavLink className={navigationLinkClassName} end to={paths.home}>
          Přehled
        </NavLink>
        {currentUser?.role === UserRole.Worker && (
          <NavLink className={navigationLinkClassName} to={paths.pickupLocations}>
            Výdejní místa
          </NavLink>
        )}
      </nav>
    </div>
    {currentUser === null && <Button onClick={onSignIn}>Přihlásit se</Button>}
    {currentUser && (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{currentUser.name}</span>
        <Button onClick={onSignOut} variant="outline">
          Odhlásit se
        </Button>
      </div>
    )}
  </div>
);

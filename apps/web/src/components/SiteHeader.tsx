import { Link, NavLink } from 'react-router-dom';
import { UserRole } from '../auth/user-role';
import { paths } from '../paths';

type SiteHeaderProps = {
  onRoleChange: (role: UserRole) => void;
  role: UserRole;
};

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export const SiteHeader = ({ onRoleChange, role }: SiteHeaderProps) => (
  <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-6">
        <Link className="text-lg font-bold tracking-tight text-slate-950" to={paths.home}>
          Půjčovna nářadí
        </Link>
        <nav aria-label="Hlavní navigace" className="flex items-center gap-1">
          <NavLink className={navigationLinkClassName} end to={paths.home}>
            Přehled
          </NavLink>
          {role === UserRole.Worker && (
            <NavLink className={navigationLinkClassName} to={paths.pickupLocations}>
              Výdejní místa
            </NavLink>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-slate-500 sm:inline">Náhled role</span>
        <div aria-label="Přepnout roli" className="flex rounded-lg bg-slate-100 p-1" role="group">
          <button
            aria-pressed={role === UserRole.Customer}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              role === UserRole.Customer
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => onRoleChange(UserRole.Customer)}
            type="button"
          >
            Uživatel
          </button>
          <button
            aria-pressed={role === UserRole.Worker}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              role === UserRole.Worker
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => onRoleChange(UserRole.Worker)}
            type="button"
          >
            Pracovník
          </button>
        </div>
      </div>
    </div>
  </header>
);

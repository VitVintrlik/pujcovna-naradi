import { Outlet } from 'react-router-dom';
import { useRole } from '../auth/RoleContext';
import { SiteHeader } from '../components/SiteHeader';

export const AppLayout = () => {
  const { role, setRole } = useRole();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader onRoleChange={setRole} role={role} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 text-sm text-slate-500 sm:px-6">
          Půjčovna nářadí
        </div>
      </footer>
    </div>
  );
};

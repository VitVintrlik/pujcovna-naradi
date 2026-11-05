import { Link } from 'react-router-dom';
import { paths } from '../paths';

export const AccessDeniedPage = () => (
  <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Přístup odepřen</p>
    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
      Tato stránka je určena pracovníkům
    </h1>
    <p className="mt-3 leading-7 text-slate-600">
      Pro náhled pracovníka přepněte roli v horní navigaci. Přepínač je pouze ukázkový a nenahrazuje
      přihlášení ani ověření oprávnění na serveru.
    </p>
    <Link
      className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      to={paths.home}
    >
      Zpět na přehled
    </Link>
  </section>
);

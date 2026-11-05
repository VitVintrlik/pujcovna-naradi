import { Link } from 'react-router-dom';
import { paths } from '../paths';

export const NotFoundPage = () => (
  <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Chyba 404</p>
    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
      Stránka nebyla nalezena
    </h1>
    <Link
      className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      to={paths.home}
    >
      Zpět na přehled
    </Link>
  </section>
);

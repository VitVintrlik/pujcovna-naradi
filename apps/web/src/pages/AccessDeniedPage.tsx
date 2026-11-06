import { buttonVariants, EmptyState } from '@pujcovna/ui';
import { Link } from 'react-router';
import { paths } from '../paths';

export const AccessDeniedPage = () => (
  <section className="mx-auto max-w-xl">
    <EmptyState
      action={
        <Link className={buttonVariants()} to={paths.home}>
          Zpět na přehled
        </Link>
      }
      description="Tato stránka je určena pracovníkům."
      title="Přístup odepřen"
    />
  </section>
);

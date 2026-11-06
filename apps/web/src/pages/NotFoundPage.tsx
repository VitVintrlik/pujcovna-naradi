import { buttonVariants, EmptyState } from '@pujcovna/ui';
import { Link } from 'react-router';
import { paths } from '../paths';

export const NotFoundPage = () => (
  <section className="mx-auto max-w-xl">
    <EmptyState
      action={
        <Link className={buttonVariants()} to={paths.home}>
          Zpět na přehled
        </Link>
      }
      description="Chyba 404"
      title="Stránka nebyla nalezena"
    />
  </section>
);

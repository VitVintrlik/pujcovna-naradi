import {
  Alert,
  AlertDescription,
  buttonVariants,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from '@pujcovna/ui';
import { Link, useLocation } from 'react-router';
import { CategoryList } from '../components/CategoryList';
import { useCategories } from '../hooks/use-categories';
import { paths } from '../paths';
import { CATEGORY_CREATED_NAVIGATION_STATE } from '../utils/category-navigation-state';
import { getErrorMessage } from '../utils/error-message';

const CATEGORY_CREATED_MESSAGE = 'Nová kategorie úspěšně vytvořena.';

export const CategoryManagementPage = () => {
  const categories = useCategories();
  const location = useLocation();
  const isCategoryCreated = location.state === CATEGORY_CREATED_NAVIGATION_STATE;
  const createCategoryLink = (
    <Link className={buttonVariants({ size: 'lg' })} to={paths.createCategory}>
      Přidat novou kategorii
    </Link>
  );

  return (
    <section className="space-y-6">
      <PageHeader
        action={createCategoryLink}
        description="Přehled kategorií nářadí v půjčovně."
        eyebrow="Správa"
        title="Kategorie"
      />
      {isCategoryCreated && (
        <Alert role="status">
          <AlertDescription>{CATEGORY_CREATED_MESSAGE}</AlertDescription>
        </Alert>
      )}
      {categories.isPending && <LoadingState label="Načítání kategorií..." />}
      {categories.isError && <ErrorState message={getErrorMessage(categories.error)} />}
      {categories.isSuccess && categories.data.length === 0 && (
        <EmptyState
          action={createCategoryLink}
          description="Zatím není vytvořena žádná kategorie."
          title="Seznam kategorií je prázdný"
        />
      )}
      {categories.isSuccess && categories.data.length > 0 && (
        <CategoryList categories={categories.data} />
      )}
    </section>
  );
};

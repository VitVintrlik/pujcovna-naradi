import type { CategoryListResponse } from '@pujcovna/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@pujcovna/ui';

type CategoryListProps = {
  categories: CategoryListResponse;
};

export const CategoryList = ({ categories }: CategoryListProps) => (
  <ul className="grid gap-4 sm:grid-cols-2">
    {categories.map(({ id, name }) => (
      <li key={id}>
        <Card>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Kategorie nářadí</p>
          </CardContent>
        </Card>
      </li>
    ))}
  </ul>
);

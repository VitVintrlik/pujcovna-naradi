import { zodResolver } from '@hookform/resolvers/zod';
import { createCategoryBodySchema, type CreateCategoryBody } from '@pujcovna/shared';
import {
  Button,
  Card,
  CardContent,
  ConfirmDialog,
  ErrorState,
  FieldGroup,
  FormInput,
  PageHeader,
} from '@pujcovna/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useCreateCategory } from '../hooks/use-create-category';
import { paths } from '../paths';
import { CATEGORY_CREATED_NAVIGATION_STATE } from '../utils/category-navigation-state';
import { getErrorMessage } from '../utils/error-message';

const DEFAULT_VALUES: CreateCategoryBody = { name: '' };
const CONFIRM_CANCEL_MESSAGE = 'Opravdu chcete zrušit přidání nové kategorie?';

export const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(createCategoryBodySchema),
  });

  const onSubmit = handleSubmit((body) => {
    createCategory.mutate(body, {
      onSuccess: async () => {
        await navigate(paths.categories, { state: CATEGORY_CREATED_NAVIGATION_STATE });
      },
    });
  });

  const onConfirmCancel = () => {
    setIsCancelOpen(false);
    void navigate(paths.categories);
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        description="Zadejte název nové kategorie nářadí."
        eyebrow="Správa"
        title="Přidat novou kategorii"
      />
      <Card>
        <CardContent>
          <form className="space-y-6" noValidate onSubmit={onSubmit}>
            <FieldGroup>
              <FormInput
                autoComplete="off"
                control={control}
                label="Název kategorie"
                maxLength={100}
                name="name"
              />
            </FieldGroup>
            {createCategory.isError && (
              <ErrorState message={getErrorMessage(createCategory.error)} />
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                disabled={createCategory.isPending}
                onClick={() => setIsCancelOpen(true)}
                type="button"
                variant="outline"
              >
                Zrušit
              </Button>
              <Button disabled={createCategory.isPending} type="submit">
                {createCategory.isPending ? 'Ukládání...' : 'Vytvořit kategorii'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ConfirmDialog
        cancelLabel="Ne"
        confirmLabel="Ano"
        description={CONFIRM_CANCEL_MESSAGE}
        onConfirm={onConfirmCancel}
        onCancel={() => setIsCancelOpen(false)}
        open={isCancelOpen}
        title="Zrušit přidání kategorie"
      />
    </section>
  );
};

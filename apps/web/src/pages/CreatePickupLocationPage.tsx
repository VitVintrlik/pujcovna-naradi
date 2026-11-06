import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPickupLocationBodySchema,
  WeekDay,
  type CreatePickupLocationBody,
} from '@pujcovna/shared';
import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  ErrorState,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FormInput,
  PageHeader,
} from '@pujcovna/ui';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { OpeningDayField } from '../components/OpeningDayField';
import { useCreatePickupLocation } from '../hooks/use-create-pickup-location';
import { paths } from '../paths';
import { getErrorMessage } from '../utils/error-message';
import { WEEK_DAY_LABELS, WEEK_DAYS } from '../utils/week-days';

const DEFAULT_VALUES: CreatePickupLocationBody = {
  name: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  openingHours: {
    [WeekDay.Monday]: null,
    [WeekDay.Tuesday]: null,
    [WeekDay.Wednesday]: null,
    [WeekDay.Thursday]: null,
    [WeekDay.Friday]: null,
    [WeekDay.Saturday]: null,
    [WeekDay.Sunday]: null,
  },
};

export const CreatePickupLocationPage = () => {
  const navigate = useNavigate();
  const createPickupLocation = useCreatePickupLocation();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(createPickupLocationBodySchema),
  });

  const onSubmit = handleSubmit((body) => {
    createPickupLocation.mutate(body, {
      onSuccess: async () => {
        await navigate(paths.pickupLocations);
      },
    });
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link className={buttonVariants({ variant: 'link' })} to={paths.pickupLocations}>
        ← Zpět na výdejní místa
      </Link>
      <PageHeader
        description="Vyplňte adresu a otevírací dobu nové pobočky."
        eyebrow="Správa"
        title="Přidat výdejní místo"
      />
      <Card>
        <CardContent>
          <form className="space-y-8" noValidate onSubmit={onSubmit}>
            <FieldSet>
              <FieldLegend>Adresa</FieldLegend>
              <FieldGroup className="grid sm:grid-cols-2">
                <FormInput
                  autoComplete="organization"
                  className="sm:col-span-2"
                  control={control}
                  label="Název výdejního místa"
                  name="name"
                />
                <FormInput
                  autoComplete="address-line1"
                  control={control}
                  label="Ulice"
                  name="street"
                />
                <FormInput
                  autoComplete="address-line2"
                  control={control}
                  label="Číslo domu"
                  name="houseNumber"
                />
                <FormInput
                  autoComplete="postal-code"
                  control={control}
                  inputMode="numeric"
                  label="PSČ"
                  name="postalCode"
                />
                <FormInput
                  autoComplete="address-level2"
                  control={control}
                  label="Město"
                  name="city"
                />
              </FieldGroup>
            </FieldSet>
            <FieldSet>
              <FieldLegend>Otevírací doba</FieldLegend>
              <FieldDescription>
                U zavřených dnů ponechte přepínač vypnutý. Zavírací čas musí být později než
                otevírací.
              </FieldDescription>
              {WEEK_DAYS.map((day) => (
                <OpeningDayField
                  control={control}
                  day={day}
                  key={day}
                  label={WEEK_DAY_LABELS[day]}
                />
              ))}
              <FieldError errors={[formState.errors.openingHours]} />
            </FieldSet>
            {createPickupLocation.isError && (
              <ErrorState message={getErrorMessage(createPickupLocation.error)} />
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                disabled={createPickupLocation.isPending}
                onClick={() => navigate(paths.pickupLocations)}
                type="button"
                variant="outline"
              >
                Zrušit
              </Button>
              <Button disabled={createPickupLocation.isPending} type="submit">
                {createPickupLocation.isPending ? 'Ukládání...' : 'Vytvořit výdejní místo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

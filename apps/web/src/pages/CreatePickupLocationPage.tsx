import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPickupLocationBodySchema, type CreatePickupLocationBody } from '@pujcovna/shared';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  ErrorState,
  Input,
  Label,
} from '@pujcovna/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useCreatePickupLocation } from '../hooks/use-create-pickup-location';
import { paths } from '../paths';
import { OPENING_DAYS } from '../utils/opening-days';

const DEFAULT_OPENING_HOURS: CreatePickupLocationBody['openingHours'] = {
  monday: { open: '08:00', close: '17:00' },
  tuesday: { open: '08:00', close: '17:00' },
  wednesday: { open: '08:00', close: '17:00' },
  thursday: { open: '08:00', close: '17:00' },
  friday: { open: '08:00', close: '16:00' },
  saturday: null,
  sunday: null,
};

export const CreatePickupLocationPage = () => {
  const navigate = useNavigate();
  const createPickupLocationMutation = useCreatePickupLocation();
  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<CreatePickupLocationBody>({
    defaultValues: {
      name: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      openingHours: DEFAULT_OPENING_HOURS,
    },
    resolver: zodResolver(createPickupLocationBodySchema),
  });
  const openingHoursValues = useWatch({
    control,
    defaultValue: DEFAULT_OPENING_HOURS,
    name: 'openingHours',
  });

  const onSubmit = handleSubmit((body) => {
    clearErrors('root.server');
    createPickupLocationMutation.mutate(body, {
      onError: (error) => {
        setError('root.server', { message: error.message });
      },
      onSuccess: () => {
        navigate(paths.pickupLocations);
      },
    });
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link
        className="text-sm font-semibold text-primary hover:underline"
        to={paths.pickupLocations}
      >
        ← Zpět na výdejní místa
      </Link>
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Správa</p>
          <CardTitle className="text-3xl">Přidat výdejní místo</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Vyplňte adresu a otevírací dobu nové pobočky.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" noValidate onSubmit={onSubmit}>
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 text-lg font-semibold">Adresa</legend>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Název výdejního místa</Label>
                <Input
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="organization"
                  id="name"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <p className="text-sm text-destructive" id="name-error" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Ulice</Label>
                <Input
                  aria-describedby={errors.street ? 'street-error' : undefined}
                  aria-invalid={Boolean(errors.street)}
                  autoComplete="address-line1"
                  id="street"
                  {...register('street')}
                />
                {errors.street?.message && (
                  <p className="text-sm text-destructive" id="street-error" role="alert">
                    {errors.street.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseNumber">Číslo domu</Label>
                <Input
                  aria-describedby={errors.houseNumber ? 'house-number-error' : undefined}
                  aria-invalid={Boolean(errors.houseNumber)}
                  autoComplete="address-line2"
                  id="houseNumber"
                  {...register('houseNumber')}
                />
                {errors.houseNumber?.message && (
                  <p className="text-sm text-destructive" id="house-number-error" role="alert">
                    {errors.houseNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">PSČ</Label>
                <Input
                  aria-describedby={errors.postalCode ? 'postal-code-error' : undefined}
                  aria-invalid={Boolean(errors.postalCode)}
                  autoComplete="postal-code"
                  id="postalCode"
                  inputMode="numeric"
                  {...register('postalCode')}
                />
                {errors.postalCode?.message && (
                  <p className="text-sm text-destructive" id="postal-code-error" role="alert">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Město</Label>
                <Input
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  aria-invalid={Boolean(errors.city)}
                  autoComplete="address-level2"
                  id="city"
                  {...register('city')}
                />
                {errors.city?.message && (
                  <p className="text-sm text-destructive" id="city-error" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-1 text-lg font-semibold">Otevírací doba</legend>
              <p className="text-sm text-muted-foreground">
                U zavřených dnů ponechte přepínač vypnutý. Zavírací čas musí být později než
                otevírací.
              </p>
              <div className="space-y-3">
                {OPENING_DAYS.map((day) => {
                  const openingHours = openingHoursValues[day.value];
                  const isOpen = openingHours !== null;
                  const openError = errors.openingHours?.[day.value]?.open?.message;
                  const closeError = errors.openingHours?.[day.value]?.close?.message;

                  return (
                    <div
                      className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[minmax(8rem,1fr)_auto_1fr_1fr] sm:items-center"
                      key={day.value}
                    >
                      <span className="font-medium">{day.label}</span>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isOpen}
                          id={`open-${day.value}`}
                          onCheckedChange={(checked) => {
                            if (typeof checked !== 'boolean') {
                              return;
                            }
                            setValue(
                              'openingHours',
                              {
                                ...openingHoursValues,
                                [day.value]: checked
                                  ? (openingHours ?? { open: '08:00', close: '17:00' })
                                  : null,
                              },
                              { shouldDirty: true, shouldValidate: true },
                            );
                          }}
                        />
                        <Label htmlFor={`open-${day.value}`}>Otevřeno</Label>
                      </div>
                      {isOpen ? (
                        <>
                          <div className="space-y-1">
                            <Label htmlFor={`open-time-${day.value}`}>Od</Label>
                            <Input
                              aria-invalid={Boolean(openError)}
                              id={`open-time-${day.value}`}
                              type="time"
                              {...register(`openingHours.${day.value}.open`)}
                            />
                            {openError && (
                              <p className="text-sm text-destructive" role="alert">
                                {openError}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`close-time-${day.value}`}>Do</Label>
                            <Input
                              aria-invalid={Boolean(closeError)}
                              id={`close-time-${day.value}`}
                              type="time"
                              {...register(`openingHours.${day.value}.close`)}
                            />
                            {closeError && (
                              <p className="text-sm text-destructive" role="alert">
                                {closeError}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground sm:col-span-2">Zavřeno</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.openingHours?.message && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.openingHours.message}
                </p>
              )}
            </fieldset>

            {errors.root?.server?.message && <ErrorState message={errors.root.server.message} />}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                disabled={createPickupLocationMutation.isPending}
                onClick={() => navigate(paths.pickupLocations)}
                type="button"
                variant="outline"
              >
                Zrušit
              </Button>
              <Button disabled={createPickupLocationMutation.isPending} type="submit">
                {createPickupLocationMutation.isPending ? 'Ukládání...' : 'Vytvořit výdejní místo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

import type { CreatePickupLocationBody, WeekDay } from '@pujcovna/shared';
import { Checkbox, Field, FieldLabel, FormInput } from '@pujcovna/ui';
import { useId } from 'react';
import { useController, type Control } from 'react-hook-form';

const EMPTY_OPENING_DAY = { open: '', close: '' };

type OpeningDayFieldProps = {
  control: Control<CreatePickupLocationBody>;
  day: WeekDay;
  label: string;
};

export const OpeningDayField = ({ control, day, label }: OpeningDayFieldProps) => {
  const checkboxId = useId();
  const { field } = useController({
    control,
    name: `openingHours.${day}`,
    rules: { deps: 'openingHours' },
  });
  const isOpen = field.value !== null;

  return (
    <div className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-4 sm:items-start">
      <span className="font-medium">{label}</span>
      <Field orientation="horizontal">
        <Checkbox
          checked={isOpen}
          id={checkboxId}
          onCheckedChange={(checked) => field.onChange(checked ? EMPTY_OPENING_DAY : null)}
        />
        <FieldLabel htmlFor={checkboxId}>Otevřeno</FieldLabel>
      </Field>
      {isOpen ? (
        <>
          <FormInput control={control} label="Od" name={`openingHours.${day}.open`} type="time" />
          <FormInput control={control} label="Do" name={`openingHours.${day}.close`} type="time" />
        </>
      ) : (
        <p className="text-sm text-muted-foreground sm:col-span-2">Zavřeno</p>
      )}
    </div>
  );
};

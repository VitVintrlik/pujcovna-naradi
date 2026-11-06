import { useId, type ComponentProps } from 'react';
import {
  useController,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Field, FieldError, FieldLabel } from './components/field';
import { Input } from './components/input';

type FormInputProps<TFieldValues extends FieldValues, TTransformedValues> = Omit<
  ComponentProps<'input'>,
  'id' | 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
  control: Control<TFieldValues, unknown, TTransformedValues>;
  name: FieldPathByValue<TFieldValues, string>;
  label: string;
};

export const FormInput = <TFieldValues extends FieldValues, TTransformedValues = TFieldValues>({
  control,
  name,
  label,
  className,
  ...inputProps
}: FormInputProps<TFieldValues, TTransformedValues>) => {
  const id = useId();
  const errorId = `${id}-error`;
  const { field, fieldState } = useController({ control, name });
  const isInvalid = fieldState.error !== undefined;

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        {...inputProps}
        {...field}
        aria-describedby={isInvalid ? errorId : undefined}
        aria-invalid={isInvalid}
        id={id}
      />
      <FieldError errors={[fieldState.error]} id={errorId} />
    </Field>
  );
};

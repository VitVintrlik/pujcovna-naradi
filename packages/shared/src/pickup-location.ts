import { z } from 'zod';

const INVALID_PICKUP_LOCATION_MESSAGE = 'Zkontrolujte povinná pole a opravte neplatné údaje.';
const INVALID_OPENING_HOURS_MESSAGE =
  'Otevírací doba musí být definována alespoň pro jeden den v týdnu. U otevřených dnů musí být vyplněn čas otevření i zavření.';
const MAX_ADDRESS_TEXT_LENGTH = 100;
const MAX_HOUSE_NUMBER_LENGTH = 20;
const LETTER_PATTERN = /\p{L}/u;
const DIGIT_PATTERN = /[0-9]/;
const POSTAL_CODE_PATTERN = /^[0-9]{5}$/;
const TIME_PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const NULL_CHARACTER = '\u0000';

export enum WeekDay {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

const pickupLocationTextSchema = z
  .string({ error: INVALID_PICKUP_LOCATION_MESSAGE })
  .trim()
  .refine((value) => !value.includes(NULL_CHARACTER), INVALID_PICKUP_LOCATION_MESSAGE);

const addressTextSchema = pickupLocationTextSchema
  .max(MAX_ADDRESS_TEXT_LENGTH, INVALID_PICKUP_LOCATION_MESSAGE)
  .regex(LETTER_PATTERN, INVALID_PICKUP_LOCATION_MESSAGE);

const openingTimeSchema = z
  .string({ error: INVALID_OPENING_HOURS_MESSAGE })
  .regex(TIME_PATTERN, INVALID_OPENING_HOURS_MESSAGE);

const openingDaySchema = z
  .object(
    { open: openingTimeSchema, close: openingTimeSchema },
    { error: INVALID_OPENING_HOURS_MESSAGE },
  )
  .nullable();

export const openingHoursSchema = z
  .record(z.enum(WeekDay), openingDaySchema, { error: INVALID_OPENING_HOURS_MESSAGE })
  .refine(
    (openingHours) => Object.values(openingHours).some((day) => day !== null),
    INVALID_OPENING_HOURS_MESSAGE,
  );

export const createPickupLocationBodySchema = z.object(
  {
    name: addressTextSchema,
    street: addressTextSchema,
    houseNumber: pickupLocationTextSchema
      .max(MAX_HOUSE_NUMBER_LENGTH, INVALID_PICKUP_LOCATION_MESSAGE)
      .regex(DIGIT_PATTERN, INVALID_PICKUP_LOCATION_MESSAGE),
    postalCode: z
      .string({ error: INVALID_PICKUP_LOCATION_MESSAGE })
      .trim()
      .regex(POSTAL_CODE_PATTERN, INVALID_PICKUP_LOCATION_MESSAGE),
    city: addressTextSchema,
    openingHours: openingHoursSchema,
  },
  { error: INVALID_PICKUP_LOCATION_MESSAGE },
);

export type CreatePickupLocationBody = z.infer<typeof createPickupLocationBodySchema>;

export const openingHoursResponseSchema = z.record(
  z.enum(WeekDay),
  z.object({ open: z.string(), close: z.string() }).nullable(),
);

export const pickupLocationResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  postalCode: z.string(),
  city: z.string(),
  openingHours: openingHoursResponseSchema,
});

export type PickupLocationResponse = z.infer<typeof pickupLocationResponseSchema>;

export const pickupLocationListResponseSchema = z.array(pickupLocationResponseSchema);

export type PickupLocationListResponse = z.infer<typeof pickupLocationListResponseSchema>;

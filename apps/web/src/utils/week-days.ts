import { WeekDay, type PickupLocationResponse } from '@pujcovna/shared';

const CLOSED_LABEL = 'Zavřeno';

export const WEEK_DAYS = Object.values(WeekDay);

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  [WeekDay.Monday]: 'Pondělí',
  [WeekDay.Tuesday]: 'Úterý',
  [WeekDay.Wednesday]: 'Středa',
  [WeekDay.Thursday]: 'Čtvrtek',
  [WeekDay.Friday]: 'Pátek',
  [WeekDay.Saturday]: 'Sobota',
  [WeekDay.Sunday]: 'Neděle',
};

export const formatOpeningDay = (openingDay: PickupLocationResponse['openingHours'][WeekDay]) =>
  openingDay ? `${openingDay.open}–${openingDay.close}` : CLOSED_LABEL;

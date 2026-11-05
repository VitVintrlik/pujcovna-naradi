import { WeekDay } from '@pujcovna/shared';

export const OPENING_DAYS = [
  { value: WeekDay.Monday, label: 'Pondělí' },
  { value: WeekDay.Tuesday, label: 'Úterý' },
  { value: WeekDay.Wednesday, label: 'Středa' },
  { value: WeekDay.Thursday, label: 'Čtvrtek' },
  { value: WeekDay.Friday, label: 'Pátek' },
  { value: WeekDay.Saturday, label: 'Sobota' },
  { value: WeekDay.Sunday, label: 'Neděle' },
] as const;

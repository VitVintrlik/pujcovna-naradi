import type { PickupLocationResponse } from '@pujcovna/shared';
import { formatOpeningDay, WEEK_DAY_LABELS, WEEK_DAYS } from '../utils/week-days';

type OpeningHoursListProps = {
  openingHours: PickupLocationResponse['openingHours'];
};

export const OpeningHoursList = ({ openingHours }: OpeningHoursListProps) => (
  <dl className="grid gap-2 sm:grid-cols-2">
    {WEEK_DAYS.map((day) => (
      <div className="flex justify-between gap-4 text-sm" key={day}>
        <dt className="text-muted-foreground">{WEEK_DAY_LABELS[day]}</dt>
        <dd>{formatOpeningDay(openingHours[day])}</dd>
      </div>
    ))}
  </dl>
);

import type { PickupLocationListResponse } from '@pujcovna/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@pujcovna/ui';
import { OPENING_DAYS } from '../utils/opening-days';

type PickupLocationListProps = {
  pickupLocations: PickupLocationListResponse;
};

export const PickupLocationList = ({ pickupLocations }: PickupLocationListProps) => (
  <ul className="grid gap-4">
    {pickupLocations.map((pickupLocation) => (
      <li key={pickupLocation.id}>
        <Card>
          <CardHeader>
            <CardTitle>{pickupLocation.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {pickupLocation.street} {pickupLocation.houseNumber}, {pickupLocation.postalCode}{' '}
              {pickupLocation.city}
            </p>
          </CardHeader>
          <CardContent>
            <h3 className="mb-3 text-sm font-semibold">Otevírací doba</h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              {OPENING_DAYS.map((day) => {
                const hours = pickupLocation.openingHours[day.value];

                return (
                  <div className="flex justify-between gap-4 text-sm" key={day.value}>
                    <dt className="text-muted-foreground">{day.label}</dt>
                    <dd>{hours ? `${hours.open}–${hours.close}` : 'Zavřeno'}</dd>
                  </div>
                );
              })}
            </dl>
          </CardContent>
        </Card>
      </li>
    ))}
  </ul>
);

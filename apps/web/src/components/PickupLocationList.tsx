import type { PickupLocationListResponse } from '@pujcovna/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Heading } from '@pujcovna/ui';
import { OpeningHoursList } from './OpeningHoursList';

type PickupLocationListProps = {
  pickupLocations: PickupLocationListResponse;
};

export const PickupLocationList = ({ pickupLocations }: PickupLocationListProps) => (
  <ul className="grid gap-4">
    {pickupLocations.map(({ id, name, street, houseNumber, postalCode, city, openingHours }) => (
      <li key={id}>
        <Card>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
              {street} {houseNumber}, {postalCode} {city}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Heading level={3}>Otevírací doba</Heading>
            <OpeningHoursList openingHours={openingHours} />
          </CardContent>
        </Card>
      </li>
    ))}
  </ul>
);

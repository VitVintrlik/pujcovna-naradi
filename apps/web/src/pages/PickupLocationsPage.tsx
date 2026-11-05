import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '@pujcovna/ui';
import { PickupLocationList } from '../components/PickupLocationList';
import { usePickupLocations } from '../hooks/use-pickup-locations';
import { paths } from '../paths';

export const PickupLocationsPage = () => {
  const pickupLocationsQuery = usePickupLocations();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Správa</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Výdejní místa</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
            Přehled poboček půjčovny a jejich dostupnosti.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          to={paths.createPickupLocation}
        >
          Přidat výdejní místo
        </Link>
      </div>
      {pickupLocationsQuery.isPending && <LoadingState label="Načítání výdejních míst..." />}
      {pickupLocationsQuery.isError && <ErrorState message={pickupLocationsQuery.error.message} />}
      {pickupLocationsQuery.isSuccess && pickupLocationsQuery.data.length === 0 && (
        <EmptyState
          action={
            <Link
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              to={paths.createPickupLocation}
            >
              Přidat výdejní místo
            </Link>
          }
          description="Zatím není vytvořeno žádné výdejní místo."
          title="Seznam je prázdný"
        />
      )}
      {pickupLocationsQuery.isSuccess && pickupLocationsQuery.data.length > 0 && (
        <PickupLocationList pickupLocations={pickupLocationsQuery.data} />
      )}
    </section>
  );
};

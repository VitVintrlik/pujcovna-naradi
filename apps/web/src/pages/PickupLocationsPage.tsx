import { buttonVariants, EmptyState, ErrorState, LoadingState, PageHeader } from '@pujcovna/ui';
import { Link } from 'react-router';
import { PickupLocationList } from '../components/PickupLocationList';
import { usePickupLocations } from '../hooks/use-pickup-locations';
import { paths } from '../paths';
import { getErrorMessage } from '../utils/error-message';

export const PickupLocationsPage = () => {
  const pickupLocations = usePickupLocations();
  const createPickupLocationLink = (
    <Link className={buttonVariants({ size: 'lg' })} to={paths.createPickupLocation}>
      Přidat výdejní místo
    </Link>
  );

  return (
    <section className="space-y-6">
      <PageHeader
        action={createPickupLocationLink}
        description="Přehled poboček půjčovny a jejich dostupnosti."
        eyebrow="Správa"
        title="Výdejní místa"
      />
      {pickupLocations.isPending && <LoadingState label="Načítání výdejních míst..." />}
      {pickupLocations.isError && <ErrorState message={getErrorMessage(pickupLocations.error)} />}
      {pickupLocations.isSuccess && pickupLocations.data.length === 0 && (
        <EmptyState
          action={createPickupLocationLink}
          description="Zatím není vytvořeno žádné výdejní místo."
          title="Seznam je prázdný"
        />
      )}
      {pickupLocations.isSuccess && pickupLocations.data.length > 0 && (
        <PickupLocationList pickupLocations={pickupLocations.data} />
      )}
    </section>
  );
};

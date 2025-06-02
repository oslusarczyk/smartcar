import { useUtils } from '../contexts/UtilsContext';
import { useQuery } from '@tanstack/react-query';
import { getPopularCars } from '../api/carsApi';
import { useNavigate } from 'react-router-dom';

import LocationSearchForm from '../components/LocationSearchForm';
import PopularCarsSection from '../components/PopularCarsSection';

export default function MainPage() {
  const { locations } = useUtils();
  const navigate = useNavigate();

  const {
    data: cars,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['mostPopularCars'],
    queryFn: () => getPopularCars(),
    staleTime: 1000 * 10 * 60,
  });

  const handleLocationSearch = (selectedLocation: string) => {
    navigate(`/cars?location=${encodeURIComponent(selectedLocation)}`);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WYNAJMIJ AUTO</h1>

      <LocationSearchForm
        locations={locations}
        onSearch={handleLocationSearch}
      />

      <PopularCarsSection
        cars={cars}
        isPending={isPending}
        isError={isError}
        error={error}
      />
    </div>
  );
}

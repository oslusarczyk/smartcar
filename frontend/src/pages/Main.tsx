import { useUtils } from '../contexts/UtilsContext';
import { useQuery } from '@tanstack/react-query';
import { getPopularCars } from '../api/carsApi';
import { useRef } from 'react';
import CarCard from '../components/CarCard';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const { locations } = useUtils();
  const navigate = useNavigate();
  const locationsRef = useRef<HTMLSelectElement>(null);
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

  function handleClick() {
    const selectedLocation = locationsRef.current?.value;
    if (selectedLocation) {
      navigate(`/cars?location=${encodeURIComponent(selectedLocation)}`);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WYNAJMIJ AUTO</h1>
      <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-md">
        <label className="mb-2 block font-medium">MIEJSCE WYNAJMU</label>
        <select
          className="mb-4 w-full rounded border px-3 py-2"
          ref={locationsRef}
        >
          {locations.map(({ location_id: id, location_name: name }) => {
            return (
              <option key={id} value={name}>
                {name}
              </option>
            );
          })}
        </select>
        <button
          className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
          onClick={handleClick}
        >
          SZUKAJ
        </button>
      </div>

      <h2 className="mt-12 mb-6 text-center text-2xl font-bold">
        NAJPOPULARNIEJSZE SAMOCHODY
      </h2>

      {isPending && <p className="text-center text-lg">Ładowanie danych...</p>}

      {isError && (
        <p className="text-center text-red-500">
          Wystąpił błąd podczas ładowania danych: {error.message}
        </p>
      )}

      {!isPending && !isError && (
        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars?.map((car) => <CarCard key={car.car_id} car={car} />)}
        </div>
      )}
    </div>
  );
}

import CarCard from './CarCard';
import type { CarListItem } from '../utils/types'; // Importuj nowy typ

interface PopularCarsSectionProps {
  cars?: CarListItem[]; // Zmień na CarListItem[]
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function PopularCarsSection({
  cars,
  isPending,
  isError,
  error,
}: PopularCarsSectionProps) {
  return (
    <div className="mt-12">
      <h2 className="mb-6 text-center text-2xl font-bold">
        NAJPOPULARNIEJSZE SAMOCHODY
      </h2>

      {isPending && <p className="text-center text-lg">Ładowanie danych...</p>}

      {isError && (
        <p className="text-center text-red-500">
          Wystąpił błąd podczas ładowania danych:{' '}
          {error?.message || 'Nieznany błąd'}
        </p>
      )}

      {!isPending && !isError && cars && (
        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.car_id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

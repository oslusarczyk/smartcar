import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCars } from '../api/carsApi';
import type { FilterParams } from '../utils/types';
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm';
import { Loader2 } from 'lucide-react'; // lub inny spinner

export default function Cars() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: cars = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['cars', filters],
    queryFn: () => getCars(filters),
    staleTime: 1000 * 60 * 5,
  });

  const carsPerPage = window.innerWidth <= 1024 ? 3 : 6;
  const totalPages = Math.ceil(cars.length / carsPerPage);
  const displayedCars = cars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage,
  );

  return (
    <div className="p-6">
      <SearchForm
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(currentPage);
        }}
      />
      <h2 className="mt-6 mb-4 text-center text-2xl font-bold">
        DOSTĘPNE SAMOCHODY
      </h2>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
      <div className="min-h-[600px] transition-all duration-300 ease-in-out">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-lg text-gray-700">Ładowanie aut...</span>
          </div>
        ) : isError ? (
          <p className="text-center text-red-500">
            Wystąpił błąd podczas ładowania danych: {error.message}
          </p>
        ) : displayedCars.length === 0 ? (
          <p className="text-center text-gray-600">
            Nie znaleziono samochodów.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-1 lg:grid-cols-3">
            {displayedCars.map((car) => (
              <CarCard key={car.car_id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

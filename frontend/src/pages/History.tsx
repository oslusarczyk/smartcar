import { useQuery } from '@tanstack/react-query';
import { Loader2, Calendar, MapPin } from 'lucide-react';
import { getReservationsByUserId } from '../api/reservationApi';
import type { Reservation } from '../utils/types';
import { useAuth } from '../auth/AuthContext';
import { formatDate } from '../utils/functions';
import carImage from '../assets/car.jpg';

export default function History() {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: confirmed,
    isLoading: loadingConfirmed,
    isError: errorConfirmed,
  } = useQuery<Reservation[]>({
    queryKey: ['reservations', userId, 'confirmed'],
    queryFn: () => getReservationsByUserId(userId as string, 'confirmed'),
    enabled: !!userId,
  });

  const {
    data: pending,
    isLoading: loadingPending,
    isError: errorPending,
  } = useQuery<Reservation[]>({
    queryKey: ['reservations', userId, 'pending'],
    queryFn: () => getReservationsByUserId(userId as string, 'pending'),
    enabled: !!userId,
  });

  const renderReservationCard = (res: Reservation) => (
    <div
      key={res.reservation_id}
      className="flex flex-col overflow-hidden rounded-xl border shadow-md md:flex-row"
    >
      <div className="h-48 w-full md:h-auto md:w-1/3">
        <img
          src={carImage}
          alt="Zdjęcie samochodu"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="text-xl font-semibold">
          {res.car.brand.brand_name} {res.car.model}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-lg text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(res.reservation_start_date)} –{' '}
            {formatDate(res.reservation_end_date)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-lg text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>{res.location.location_name}</span>
        </div>
        <div className="mt-2 text-lg font-bold text-green-700">
          {res.reservation_price} PLN
        </div>
      </div>
    </div>
  );

  const renderReservationSection = (
    title: string,
    reservations?: Reservation[],
    isLoading?: boolean,
    isError?: boolean,
  ) => (
    <div className="mb-10">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          Ładowanie...
        </div>
      ) : isError ? (
        <p className="text-red-500">Nie udało się załadować danych.</p>
      ) : !reservations?.length ? (
        <p className="text-gray-600">Brak danych</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map(renderReservationCard)}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      {renderReservationSection(
        'Potwierdzone rezerwacje',
        confirmed,
        loadingConfirmed,
        errorConfirmed,
      )}
      {renderReservationSection(
        'Oczekujące rezerwacje',
        pending,
        loadingPending,
        errorPending,
      )}
    </div>
  );
}

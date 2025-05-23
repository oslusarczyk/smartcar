import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Reservation, Status } from '../utils/types';
import { formatDate } from '../utils/functions';
import carImage from '../assets/car.jpg';
import {
  getPendingReservations,
  updateReservationStatus,
} from '../api/reservationApi';
import { AtSign, Calendar, Check, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function CarAdmin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: pending = [],
    isLoading,
    isError,
  } = useQuery<Reservation[]>({
    queryKey: ['reservations', 'pending'],
    queryFn: getPendingReservations,
  });

  const mutation = useMutation({
    mutationFn: ({
      reservationId,
      decision,
    }: {
      reservationId: string;
      decision: Status;
    }) => updateReservationStatus(reservationId, decision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', 'pending'] });
    },
  });

  const handleAction = (reservationId: string, decision: Status) => {
    mutation.mutate({ reservationId, decision });
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="space-y-6">
        {isLoading ? (
          <h2 className="text-xl font-semibold">Ładowanie rezerwacji...</h2>
        ) : isError ? (
          <h2 className="text-xl font-semibold text-red-600">
            Wystąpił błąd podczas ładowania
            <button
              onClick={() => navigate(-1)}
              className="rounded bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
            >
              Wróć
            </button>
          </h2>
        ) : pending.length === 0 ? (
          <h2 className="text-xl font-semibold">
            Brak rezerwacji do potwierdzenia
          </h2>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Rezerwacje do potwierdzenia</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pending.map((reservation) => {
                const carName = `${reservation.car.brand.brand_name} ${reservation.car.model}`;
                return (
                  <div
                    key={reservation.reservation_id}
                    className="flex overflow-hidden rounded-2xl border shadow-md"
                  >
                    <div className="w-1/3">
                      <img
                        src={carImage}
                        alt="car"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex w-2/3 flex-col justify-between space-y-2 p-4">
                      <div>
                        <h4 className="text-lg font-semibold">{carName}</h4>
                        <div className="mt-1 flex items-center gap-2 text-lg text-gray-700">
                          <Calendar className="h-4 w-4" />
                          od {formatDate(reservation.reservation_start_date)}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-lg text-gray-700">
                          <Calendar className="h-4 w-4" />
                          do {formatDate(reservation.reservation_end_date)}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-lg text-gray-700">
                          <MapPin className="h-4 w-4" />
                          <span>{reservation.location.location_name}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-lg text-gray-700">
                          <AtSign className="h-4 w-4" />
                          <span>{reservation.user.email}</span>
                        </div>

                        <p className="mt-1 text-lg font-bold">
                          {reservation.reservation_price} PLN
                        </p>
                      </div>

                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          className="flex items-center gap-1 rounded-lg border-black bg-red-600 px-2 py-3 text-white transition hover:bg-red-400"
                          onClick={() =>
                            handleAction(
                              reservation.reservation_id,
                              'cancelled' as Status,
                            )
                          }
                        >
                          <X /> Odrzuć
                        </button>
                        <button
                          className="flex items-center gap-1 rounded-lg border bg-green-600 px-2 py-3 text-white transition hover:bg-green-400"
                          onClick={() =>
                            handleAction(
                              reservation.reservation_id,
                              'confirmed' as Status,
                            )
                          }
                        >
                          <Check /> Potwierdź
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              ;
            </div>
          </>
        )}
      </div>
    </div>
  );
}

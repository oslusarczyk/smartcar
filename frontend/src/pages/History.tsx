import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Calendar, MapPin } from 'lucide-react';
import { getReservationsByUserId } from '../api/reservationApi';
import type { PaymentStatus, Reservation } from '../utils/types';
import { useAuth } from '../auth/AuthContext';
import { formatDate } from '../utils/functions';
import carImage from '../assets/car.jpg';
import { useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import { updatePayment } from '../api/paymentsApi';

export default function History() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const userId = user?.id;
  const queryClient = useQueryClient();

  const {
    data: reservations,
    isLoading,
    isError,
  } = useQuery<Reservation[]>({
    queryKey: ['reservations', userId],
    queryFn: () => getReservationsByUserId(userId as string),
    enabled: !!userId,
  });

  const payMutation = useMutation({
    mutationFn: ({
      payment_id,
      status,
    }: {
      payment_id: string;
      status: PaymentStatus;
    }) => updatePayment(payment_id, status),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const getStatusLabelAndColor = (
    status: Reservation['reservation_status'],
  ) => {
    switch (status) {
      case 'approved':
        return { label: 'Oczekuje na płatność', color: 'text-blue-600' };
      case 'confirmed':
        return { label: 'Potwierdzona', color: 'text-green-700' };
      case 'cancelled':
        return { label: 'Anulowana', color: 'text-red-600' };
      case 'pending':
        return { label: 'Oczekuje na decyzję', color: 'text-gray-600' };
      default:
        return { label: 'Nieznany status', color: 'text-gray-400' };
    }
  };

  const renderReservationCard = (res: Reservation) => {
    const { label, color } = getStatusLabelAndColor(res.reservation_status);

    return (
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

          <div className={`mt-2 text-sm font-semibold ${color}`}>
            Status: {label}
          </div>

          {res.reservation_status === 'approved' && (
            <button
              onClick={() => {
                setSelectedReservation(res);
                setOpen(true);
              }}
              className="mt-4 w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
            >
              Opłać
            </button>
          )}

          <PaymentModal
            open={open}
            onClose={() => setOpen(false)}
            onAction={(status) => {
              if (selectedReservation?.reservation_id) {
                payMutation.mutate({
                  payment_id: selectedReservation.reservation_id,
                  status,
                });
              }
            }}
            isLoading={payMutation.isPending}
            reservation={selectedReservation}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="mb-4 text-xl font-bold">Twoje rezerwacje</h2>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          Ładowanie...
        </div>
      ) : isError ? (
        <p className="text-red-500">Nie udało się załadować danych.</p>
      ) : !reservations?.length ? (
        <p className="text-gray-600">Brak rezerwacji</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map(renderReservationCard)}
        </div>
      )}
    </div>
  );
}

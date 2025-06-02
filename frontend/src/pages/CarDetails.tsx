import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getCarDetails } from '../api/carsApi';

import type {
  CarDetailsProps,
  Location,
  ReservationFormData,
  ReservationPayload,
} from '../utils/types';
import { getLocationsByCar } from '../api/utilsApi';
import { useAuth } from '../auth/AuthContext';
import { addReservation } from '../api/reservationApi';
import toast from 'react-hot-toast';
import { BASE_URL } from '../api/axios';
import LabeledField from '../components/Label';
import LoginPromptModal from '../components/LoginModal';
import CarHeaderInfo from '../components/CarHeader';
import { Loader2 } from 'lucide-react';

export default function CarDetails() {
  const IMAGE_PATH = `${BASE_URL}/uploads`;
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [totalPrice, setTotalPrice] = useState<number | null>(250);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const {
    data: car,
    isLoading: isCarLoading,
    error: carError,
  } = useQuery<CarDetailsProps>({
    queryKey: ['carDetails', id],
    queryFn: () => getCarDetails(id!),
    enabled: !!id,
  });

  const { data: locations } = useQuery<Location[]>({
    queryKey: ['locations', car?.car_id],
    queryFn: () => getLocationsByCar(car!.car_id),
    enabled: !!car?.car_id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReservationFormData>({
    mode: 'onChange',
  });

  const watchStartDate = watch('reservationStartDate');
  const watchEndDate = watch('reservationEndDate');

  const calculateTotalPrice = (
    startDate: string,
    endDate: string,
    price: number,
  ): number => {
    const DAY_DATE = 1000 * 60 * 60 * 24;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    const reservation_days = Math.ceil(
      (end.getTime() - start.getTime()) / DAY_DATE,
    );
    const reservation_price = Math.round(price * reservation_days);
    return reservation_price;
  };

  useEffect(() => {
    if (watchStartDate && watchEndDate && car?.price_per_day) {
      const price = calculateTotalPrice(
        watchStartDate,
        watchEndDate,
        car.price_per_day,
      );
      setTotalPrice(price);
    } else {
      setTotalPrice(null);
    }
  }, [watchStartDate, watchEndDate]);

  const reservationMutation = useMutation({
    mutationFn: async (payload: ReservationPayload) => {
      return await addReservation(payload);
    },
    onSuccess: () => {
      toast.success('Rezerwacja została dodana!');
      navigate('/history');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Wystąpił błąd');
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    reservationMutation.mutate({
      reservation_start_date: data.reservationStartDate,
      reservation_end_date: data.reservationEndDate,
      location_id: data.selectedLocation,
      car_id: car!.car_id,
      user_id: user.id,
    });
  };

  if (isCarLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <span className="ml-2 text-lg">Ładowanie szczegółów auta...</span>
      </div>
    );
  }

  if (carError || !car) {
    return (
      <>
        <p className="flex px-5 text-center text-red-500">
          {carError?.message || 'Nie znaleziono szczegółów samochodu.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
        >
          Wróć
        </button>
      </>
    );
  }

  const inputClassNames = 'rounded border px-3 py-2 w-full';

  return (
    <div className="mx-auto max-w-6xl p-6">
      <CarHeaderInfo car={car} locations={locations} imagePath={IMAGE_PATH} />

      <div className="mt-8">
        <h3 className="mb-2 text-xl font-semibold">Opis</h3>
        <p className="text-gray-800">{car.car_description}</p>
      </div>

      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}

      <div className="mt-10 rounded-xl border p-6 shadow-md">
        <h4 className="mb-4 text-lg font-semibold">Formularz rezerwacji</h4>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <LabeledField
            label="Od:"
            id="reservationStartDate"
            errors={errors.reservationStartDate as any}
          >
            <input
              type="date"
              {...register('reservationStartDate', {
                required: 'Pole wymagane',
              })}
              min={new Date().toISOString().split('T')[0]}
              className={inputClassNames}
            />
          </LabeledField>

          <LabeledField
            label="Do:"
            id="reservationEndDate"
            errors={errors.reservationEndDate as any}
          >
            <input
              type="date"
              {...register('reservationEndDate', {
                required: 'Pole wymagane',
              })}
              min={new Date().toISOString().split('T')[0]}
              className={inputClassNames}
            />
          </LabeledField>

          <LabeledField
            label="Miejsce wynajmu:"
            id="selectedLocation"
            errors={errors.selectedLocation as any}
          >
            <select
              {...register('selectedLocation', {
                required: 'Wybierz lokalizację',
              })}
              className={inputClassNames}
            >
              <option value="">Wybierz lokalizację</option>
              {locations?.map(({ location_id, location_name }) => (
                <option key={location_id} value={location_id}>
                  {location_name}
                </option>
              ))}
            </select>
          </LabeledField>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="mt-4 w-full rounded bg-green-600 py-2 text-white transition hover:bg-green-700"
            >
              Zarezerwuj
            </button>
          </div>
        </form>
        {totalPrice !== null && totalPrice > 0 && (
          <div className="mt-4 text-right text-xl font-semibold md:col-span-3">
            Łączna cena:{' '}
            <span className="text-xl font-bold text-green-700">
              {' '}
              {totalPrice} PLN
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

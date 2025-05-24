import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getCarDetails } from '../api/carsApi';
import { Calendar, Loader2, MapPin, UserRound } from 'lucide-react';
import carImage from '../assets/car.jpg';
import { getSeatsText } from '../utils/functions';
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

export default function CarDetails() {
  const IMAGE_PATH = `${BASE_URL}/uploads`;
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
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
  } = useForm<ReservationFormData>({
    mode: 'onChange',
  });

  const reservationMutation = useMutation({
    mutationFn: async (payload: ReservationPayload) => {
      return await addReservation(payload);
    },
    onSuccess: () => {
      toast.success('Rezerwacja została dodana!');
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

  const carName = `${car.brand} ${car.model}`;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <img
            src={`${IMAGE_PATH}/${car.photo}`}
            alt={`${car.brand} ${car.model}`}
            className="w-full rounded-xl shadow-md"
          />
        </div>

        <div className="bg-alpha-50 flex flex-1 flex-col gap-2 rounded-xl p-6 text-2xl shadow-md">
          <h2 className="text-2xl font-bold">{carName}</h2>

          <div className="flex items-center gap-1">
            <span className="text-lg">
              <MapPin />
            </span>
            {locations?.length
              ? locations.map((location) => location.location_name).join(', ') +
                ' '
              : null}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">
              <UserRound />
            </span>
            {car.seats_available} {getSeatsText(car.seats_available)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">
              <Calendar />
            </span>
            {car.production_year}
          </div>
          <div className="text-4xl font-bold uppercase">
            od {car.price_per_day} PLN
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 text-xl font-semibold">Opis</h3>
        <p className="text-gray-800">{car.car_description}</p>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Zaloguj się</h2>
            <p className="mb-6">
              Musisz być zalogowany, aby zarezerwować samochód.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Przejdź do logowania
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border p-6 shadow-md">
        <h4 className="mb-4 text-lg font-semibold">Formularz rezerwacji</h4>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="flex flex-col">
            <label htmlFor="reservationStartDate">Od:</label>
            <input
              type="date"
              id="reservationStartDate"
              {...register('reservationStartDate', {
                required: 'Pole wymagane',
              })}
              min={new Date().toISOString().split('T')[0]}
              className="rounded border px-3 py-2"
            />
            {errors.reservationStartDate && (
              <p className="text-sm text-red-500">
                {errors.reservationStartDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="reservationEndDate">Do:</label>
            <input
              type="date"
              id="reservationEndDate"
              {...register('reservationEndDate', {
                required: 'Pole wymagane',
              })}
              min={new Date().toISOString().split('T')[0]}
              className="rounded border px-3 py-2"
            />
            {errors.reservationEndDate && (
              <p className="text-sm text-red-500">
                {errors.reservationEndDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="selectedLocation">Miejsce wynajmu:</label>
            <select
              id="selectedLocation"
              {...register('selectedLocation', {
                required: 'Wybierz lokalizację',
              })}
              className="rounded border px-3 py-2"
            >
              <option value="">Wybierz lokalizację</option>
              {locations?.map(({ location_id, location_name }) => (
                <option key={location_id} value={location_id}>
                  {location_name}
                </option>
              ))}
            </select>
            {errors.selectedLocation && (
              <p className="text-sm text-red-500">
                {errors.selectedLocation.message}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="mt-4 w-full rounded bg-green-600 py-2 text-white transition hover:bg-green-700"
            >
              Zarezerwuj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

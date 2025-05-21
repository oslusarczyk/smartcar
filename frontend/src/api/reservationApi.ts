import type { Reservation, ReservationPayload, Status } from '../utils/types';
import { api } from './axios';

export const addReservation = async (payload: ReservationPayload) => {
  const { data } = await api.post('/reservations', payload);
  return data;
};

export const getReservationsByUserId = async (
  userId: string,
  status: Status,
) => {
  const { data } = await api.get<Reservation[]>('/reservations', {
    params: { user_id: userId, status },
  });
  return data;
};

export const getPendingReservations = async () => {
  const { data } = await api.get<Reservation[]>('/reservations/pending');
  return data;
};

export const updateReservationStatus = async (id: string, status: Status) => {
  const { data } = await api.put<Reservation>(`/reservations/${id}`, {
    status,
  });
  return data;
};

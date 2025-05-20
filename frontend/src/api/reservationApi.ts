import type { ReservationPayload } from '../utils/types';
import { api } from './axios';

export const addReservation = async (payload: ReservationPayload) => {
  const { data } = await api.post('/reservations', payload);
  return data;
};

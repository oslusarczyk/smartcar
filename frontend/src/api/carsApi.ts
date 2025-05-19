import type { Car } from '../utils/types';
import { api } from './axios';

export const getPopularCars = async () => {
  const res = await api.get<Car[]>('/cars/most-popular');
  return res.data;
};

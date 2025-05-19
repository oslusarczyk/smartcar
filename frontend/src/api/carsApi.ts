import type { Car, FilterParams } from '../utils/types';
import { api } from './axios';

export const getPopularCars = async () => {
  const res = await api.get<Car[]>('/cars/most-popular');
  return res.data;
};

export const getCars = async (filters: FilterParams) => {
  const res = await api.get<Car[]>('/cars', {
    params: { ...filters },
  });
  return res.data;
};

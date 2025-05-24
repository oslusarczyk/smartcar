import type { Car, CarDetailsProps, FilterParams } from '../utils/types';
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

export const getCarDetails = async (id: string) => {
  const res = await api.get<CarDetailsProps>(`/cars/${id}`);
  return res.data;
};

export const addCar = async (formData: FormData) => {
  console.log(formData);
  const res = await api.post<Car>('/cars/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

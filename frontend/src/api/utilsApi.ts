import type { Brand, Location } from '../utils/types';
import { api } from './axios';

export const getBrands = async () => {
  const res = await api.get<Brand[]>('/brands');
  return res.data;
};

export const getLocations = async () => {
  const res = await api.get<Location[]>('/locations');
  return res.data;
};

export const getLocationsByCar = async (id: string) => {
  const res = await api.get<Location[]>(`/locations/${id}`);
  return res.data;
};

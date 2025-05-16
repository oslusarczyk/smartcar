import { api } from './axios';
// import type { LoginResponse } from '../auth/AuthTypes';

// export const loginUser = async (payload: {
//   email: string;
//   password: string;
// }): Promise<LoginResponse> => {
//   const { data } = await api.post<LoginResponse>('/auth/login', payload);
//   return data;
// };

export const registerUser = async (payload: {
  email: string;
  password: string;
}) => {
  return api.post('/auth/register', payload);
};

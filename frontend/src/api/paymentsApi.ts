import type { PaymentStatus } from '../utils/types';
import { api } from './axios';

export const updatePayment = async (
  payment_id: string,
  payment_status: PaymentStatus,
) => {
  const res = await api.put(`/payments/${payment_id}`, { payment_status });
  return res.data;
};

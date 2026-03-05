import type { CreateWithdrawalRequest, Withdrawal } from '@/lib/api/withdrawals/types';
import { apiFetch } from '../client';

export function createWithdrawal(data: CreateWithdrawalRequest): Promise<Withdrawal> {
  return apiFetch<Withdrawal>('/api/v1/withdrawals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getWithdrawal(id: string): Promise<Withdrawal> {
  return apiFetch<Withdrawal>(`/api/v1/withdrawals/${id}`);
}

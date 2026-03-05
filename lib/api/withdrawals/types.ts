export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Withdrawal {
  id: string;
  amount: number;
  destination: string;
  status: WithdrawalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWithdrawalRequest {
  amount: number;
  destination: string;
  idempotency_key: string;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
}

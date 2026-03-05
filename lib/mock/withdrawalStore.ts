import type { Withdrawal, WithdrawalStatus } from "../api/withdrawals/types";

const withdrawalsByKey = new Map<string, Withdrawal>();
const withdrawalsById = new Map<string, Withdrawal>();

const STATUS_PROGRESSION: WithdrawalStatus[] = ['pending', 'processing', 'completed'];

export function findByKey(idempotencyKey: string): Withdrawal | undefined {
  return withdrawalsByKey.get(idempotencyKey);
}

export function findById(id: string): Withdrawal | undefined {
  const withdrawal = withdrawalsById.get(id);
  if (!withdrawal) return undefined;

  const currentIndex = STATUS_PROGRESSION.indexOf(withdrawal.status);
  if (currentIndex < STATUS_PROGRESSION.length - 1) {
    withdrawal.status = STATUS_PROGRESSION[currentIndex + 1];
    withdrawal.updatedAt = new Date().toISOString();
  }

  return withdrawal;
}

export function create(
  id: string,
  idempotencyKey: string,
  amount: number,
  destination: string,
): Withdrawal {
  const now = new Date().toISOString();
  const withdrawal: Withdrawal = {
    id,
    amount,
    destination,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  withdrawalsByKey.set(idempotencyKey, withdrawal);
  withdrawalsById.set(id, withdrawal);
  return withdrawal;
}

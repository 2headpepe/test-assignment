'use client';

import { useWithdrawStore } from '@/lib/store/withdrawStore';
import { WithdrawForm } from '../WithdrawForm';
import { WithdrawError } from '../WithdrawError';
import { WithdrawSuccess } from '../WithdrawSuccess';
import styles from './index.module.css';

export function WithdrawPageClient() {
  const submitState = useWithdrawStore((state) => state.submitState);

  if (submitState === 'success') {
    return <WithdrawSuccess />;
  }

  return (
    <div className={styles.container}>
      <h1>Withdraw USDT</h1>
      {submitState === 'error' && <WithdrawError />}
      <WithdrawForm />
    </div>
  );
}

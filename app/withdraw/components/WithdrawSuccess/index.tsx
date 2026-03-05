'use client';

import { memo } from 'react';
import { useWithdrawStore } from '@/lib/store/withdrawStore';
import styles from './index.module.css';

export const WithdrawSuccess = memo(function WithdrawSuccess() {
  const { withdrawal, newWithdrawal } = useWithdrawStore();

  if (!withdrawal) return null;

  return (
    <div role="status" data-testid="success-screen" className={styles.success}>
      <h2>Withdrawal submitted</h2>
      <div className={styles.details}>
        <div className={styles.row}><span>ID</span><span>{withdrawal.id}</span></div>
        <div className={styles.row}><span>Amount</span><span>{withdrawal.amount} USDT</span></div>
        <div className={styles.row}><span>Destination</span><span>{withdrawal.destination}</span></div>
        <div className={styles.row}><span>Status</span><span>{withdrawal.status}</span></div>
      </div>
      <button onClick={newWithdrawal} className={styles.newButton}>New withdrawal</button>
    </div>
  );
});

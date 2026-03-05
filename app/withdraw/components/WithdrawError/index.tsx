'use client';

import { memo } from 'react';
import { useWithdrawStore } from '@/lib/store/withdrawStore';
import styles from './index.module.css';

export const WithdrawError = memo(function WithdrawError() {
  const { errorMessage, resetToIdle } = useWithdrawStore();

  return (
    <div role="alert" data-testid="error-alert" className={styles.error}>
      <p>{errorMessage}</p>
      <button onClick={resetToIdle} className={styles.dismissButton}>Dismiss</button>
    </div>
  );
});

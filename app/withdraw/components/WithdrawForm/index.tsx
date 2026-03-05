'use client';

import { useWithdrawStore } from '@/lib/store/withdrawStore';
import styles from './index.module.css';

export function WithdrawForm() {
  const { formDraft, submitState, setFormDraft, submit } = useWithdrawStore();
  const isLoading = submitState === 'loading';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    await submit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate={false}>
      <div className={styles.field}>
        <label htmlFor="amount">Amount (USDT)</label>
        <input
          id="amount"
          data-testid="amount-input"
          type="number"
          min="0.01"
          step="any"
          required
          value={formDraft.amount}
          onChange={(e) => setFormDraft({ amount: e.target.value })}
          disabled={isLoading}
          placeholder="0.00"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="destination">Destination address</label>
        <input
          id="destination"
          data-testid="destination-input"
          type="text"
          required
          value={formDraft.destination}
          onChange={(e) => setFormDraft({ destination: e.target.value })}
          disabled={isLoading}
          placeholder="Wallet address"
        />
      </div>

      <div className={styles.checkboxField}>
        <input
          id="confirm"
          data-testid="confirm-checkbox"
          type="checkbox"
          required
          disabled={isLoading}
        />
        <label htmlFor="confirm">I confirm this withdrawal</label>
      </div>

      <button type="submit" disabled={isLoading} data-testid="submit-button" className={styles.submitButton}>
        {isLoading ? 'Processing...' : 'Withdraw'}
      </button>
    </form>
  );
}

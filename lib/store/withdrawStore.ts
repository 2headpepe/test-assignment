import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Withdrawal } from '../api/withdrawals/types';
import { createWithdrawal } from '../api/withdrawals/withdrawals';
import { ApiError, NetworkError } from '../api/client';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface FormDraft {
  amount: string;
  destination: string;
}

interface WithdrawState {
  formDraft: FormDraft;
  idempotencyKey: string | null;
  savedAt: string | null;
  submitState: SubmitState;
  withdrawal: Withdrawal | null;
  errorMessage: string | null;

  setFormDraft: (draft: Partial<FormDraft>) => void;
  submit: () => Promise<void>;
  resetToIdle: () => void;
  newWithdrawal: () => void;
  clearFormDraft: () => void;
}

const FIVE_MINUTES = 5 * 60 * 1000;

export const useWithdrawStore = create<WithdrawState>()(
  persist(
    (set, get) => ({
      formDraft: { amount: '', destination: '' },
      idempotencyKey: null,
      savedAt: null,
      submitState: 'idle',
      withdrawal: null,
      errorMessage: null,

      setFormDraft: (draft) => {
        set((state) => ({
          formDraft: { ...state.formDraft, ...draft },
          savedAt: new Date().toISOString(),
        }));
      },

      submit: async () => {
        const { formDraft, idempotencyKey } = get();
        const key = idempotencyKey ?? crypto.randomUUID();

        set({ submitState: 'loading', errorMessage: null, idempotencyKey: key });

        try {
          const withdrawal = await createWithdrawal({
            amount: Number(formDraft.amount),
            destination: formDraft.destination,
            idempotency_key: key,
          });
          set({
            submitState: 'success',
            withdrawal,
            idempotencyKey: null,
            formDraft: { amount: '', destination: '' },
            savedAt: null,
          });
        } catch (error) {
          if (error instanceof ApiError && error.status === 409) {
            set({ submitState: 'error', errorMessage: 'Заявка уже существует' });
          } else if (error instanceof NetworkError) {
            set({ submitState: 'error', errorMessage: 'Нет соединения. Попробуйте ещё раз.' });
          } else {
            set({ submitState: 'error', errorMessage: 'Произошла ошибка. Попробуйте ещё раз.' });
          }
        }
      },

      resetToIdle: () => {
        set({ submitState: 'idle', errorMessage: null });
      },

      newWithdrawal: () => {
        set({
          submitState: 'idle',
          withdrawal: null,
          errorMessage: null,
          idempotencyKey: null,
          formDraft: { amount: '', destination: '' },
          savedAt: null,
        });
      },

      clearFormDraft: () => {
        set({ formDraft: { amount: '', destination: '' }, idempotencyKey: null, savedAt: null });
      },
    }),
    {
      name: 'withdraw-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        formDraft: state.formDraft,
        idempotencyKey: state.idempotencyKey,
        savedAt: state.savedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.savedAt) {
          const age = Date.now() - new Date(state.savedAt).getTime();
          if (age > FIVE_MINUTES) {
            state.clearFormDraft();
          }
        }
      },
    },
  ),
);

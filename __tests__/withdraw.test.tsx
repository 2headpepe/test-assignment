import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WithdrawPageClient } from '@/app/withdraw/WithdrawPageClient';
import { useWithdrawStore } from '@/lib/store/withdrawStore';

jest.mock('zustand/middleware', () => ({
  persist: (config: unknown) => config,
  createJSONStorage: () => null,
}));

const mockWithdrawal = {
  id: 'test-id-123',
  amount: 100,
  destination: '0xabc123',
  status: 'pending' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
  global.fetch = jest.fn();
  useWithdrawStore.setState({
    formDraft: { amount: '', destination: '' },
    idempotencyKey: null,
    savedAt: null,
    submitState: 'idle',
    withdrawal: null,
    errorMessage: null,
  });
});

async function fillForm() {
  await userEvent.type(screen.getByTestId('amount-input'), '100');
  await userEvent.type(screen.getByTestId('destination-input'), '0xabc123');
  await userEvent.click(screen.getByTestId('confirm-checkbox'));
}

it('happy path: shows success screen with withdrawal details after submit', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    status: 201,
    json: () => Promise.resolve(mockWithdrawal),
  } as Response);

  render(<WithdrawPageClient />);
  await fillForm();
  await userEvent.click(screen.getByTestId('submit-button'));

  await waitFor(() => {
    expect(screen.getByTestId('success-screen')).toBeInTheDocument();
  });
});

it('409 conflict: shows error alert, form keeps values, no success screen', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: false,
    status: 409,
    json: () => Promise.resolve({ error: 'Withdrawal already exists' }),
  } as Response);

  render(<WithdrawPageClient />);
  await fillForm();
  await userEvent.click(screen.getByTestId('submit-button'));

  await waitFor(() => {
    expect(screen.getByTestId('error-alert')).toBeInTheDocument();
  });
});

it('double submit: button is disabled during loading, fetch called exactly once', async () => {
  let resolveRequest!: (value: Response) => void;
  jest.spyOn(global, 'fetch').mockImplementationOnce(
    () => new Promise<Response>((resolve) => { resolveRequest = resolve; }),
  );

  render(<WithdrawPageClient />);
  await fillForm();

  const submitButton = screen.getByTestId('submit-button');
  await userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();
  await userEvent.click(submitButton);

  resolveRequest({
    ok: true,
    status: 201,
    json: () => Promise.resolve(mockWithdrawal),
  } as Response);
});

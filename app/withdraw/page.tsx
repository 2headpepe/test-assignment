import { Suspense } from 'react';
import { WithdrawPageClient } from './components/WithdrawPageClient';

export default function WithdrawPage() {
  return (
    <Suspense>
      <WithdrawPageClient />
    </Suspense>
  );
}

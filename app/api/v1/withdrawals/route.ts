import { NextRequest, NextResponse } from 'next/server';
import { findByKey, create } from '@/lib/mock/withdrawalStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  await delay(600);

  const body = await request.json();
  const { amount, destination, idempotency_key } = body;

  const existing = findByKey(idempotency_key);
  if (existing) {
    return NextResponse.json({ error: 'Withdrawal already exists' }, { status: 409 });
  }

  const withdrawal = create(crypto.randomUUID(), idempotency_key, amount, destination);
  return NextResponse.json(withdrawal, { status: 201 });
}

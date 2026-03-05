import { NextRequest, NextResponse } from 'next/server';
import { findById } from '@/lib/mock/withdrawalStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  await delay(200);

  const withdrawal = findById(params.id);
  if (!withdrawal) {
    return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
  }

  return NextResponse.json(withdrawal);
}

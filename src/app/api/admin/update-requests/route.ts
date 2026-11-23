import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UpdateRequest from '@/models/UpdateRequest';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const requests = await UpdateRequest.find({ status: 'pending' }).populate('testerId').lean();
  return NextResponse.json(requests);
}

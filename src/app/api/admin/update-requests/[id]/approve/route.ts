import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UpdateRequest from '@/models/UpdateRequest';
import TesterProfile from '@/models/TesterProfile';
import { getAuthFromCookies } from '@/lib/auth';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const ur = await UpdateRequest.findById(params.id);
  if (!ur) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await TesterProfile.findByIdAndUpdate(ur.testerId, { $set: ur.proposedChanges });
  ur.status = 'approved';
  await ur.save();
  return NextResponse.json({ ok: true });
}

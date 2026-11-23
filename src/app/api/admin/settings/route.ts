import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppSettings from '@/models/AppSettings';
import { getAuthFromCookies } from '@/lib/auth';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  await connectDB();
  const doc = await AppSettings.findOne({ key: 'newUserRegistration' }).lean() as { value: boolean } | null;
  return NextResponse.json({ newUserRegistration: doc?.value ?? false });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!isAdmin(req) && auth?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const { newUserRegistration } = await req.json();
  await AppSettings.findOneAndUpdate(
    { key: 'newUserRegistration' },
    { $set: { value: Boolean(newUserRegistration) } },
    { upsert: true, new: true }
  );
  return NextResponse.json({ newUserRegistration: Boolean(newUserRegistration) });
}
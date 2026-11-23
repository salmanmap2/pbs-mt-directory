import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const profiles = await TesterProfile.find({ isDeleted: false }).lean();
  return NextResponse.json(profiles);
}
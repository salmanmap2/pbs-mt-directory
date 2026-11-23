import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const testers = await TesterProfile.find({ isDeleted: false }).lean();
  return NextResponse.json(testers);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  if (!body.mobileNumber || !/^01[3-9]\d{8}$/.test(body.mobileNumber)) {
    return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
  }
  await connectDB();
  const existing = await TesterProfile.findOne({ mobileNumber: body.mobileNumber });
  if (existing) return NextResponse.json({ error: 'Mobile number already registered' }, { status: 409 });
  const tester = await TesterProfile.create(body);
  return NextResponse.json(tester, { status: 201 });
}

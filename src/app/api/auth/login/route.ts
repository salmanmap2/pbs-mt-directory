import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import { signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { mobileNumber } = await req.json();
  if (!mobileNumber || !/^01[3-9]\d{8}$/.test(mobileNumber)) {
    return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
  }
  await connectDB();
  const tester = await TesterProfile.findOne({ mobileNumber, isDeleted: false });
  if (!tester) {
    return NextResponse.json({ error: 'Mobile number not registered in PBS database.' }, { status: 401 });
  }
  const token = await signToken({ userId: tester._id.toString(), mobileNumber, role: 'user' });
  const res = NextResponse.json({ ok: true, userId: tester._id });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}

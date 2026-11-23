import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import AppSettings from '@/models/AppSettings';
import { signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { mobileNumber } = await req.json();
  if (!mobileNumber || !/^01[3-9]\d{8}$/.test(mobileNumber)) {
    return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
  }
  await connectDB();

  const tester = await TesterProfile.findOne({ mobileNumber, isDeleted: false });

  if (tester) {
    const token = await signToken({ userId: tester._id.toString(), mobileNumber, role: 'user' });
    const res = NextResponse.json({ ok: true, userId: tester._id });
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  }

  // New number — check setting
  const setting = await AppSettings.findOne({ key: 'newUserRegistration' }).lean() as { value: boolean } | null;
  const registrationOpen = setting?.value ?? false;

  if (!registrationOpen) {
    return NextResponse.json(
      { error: 'এই মোবাইল নম্বরটি PBS ডেটাবেসে নেই। Admin-এর সাথে যোগাযোগ করুন।' },
      { status: 401 }
    );
  }

  const newTester = await TesterProfile.create({
    mobileNumber,
    fullName: 'New User',
    post: 'Meter Tester',
    pbs: 'Unknown',
    office: 'Unknown',
    ownDistrict: 'Unknown',
    joiningDate: new Date(),
    isDeleted: false,
    editLimit: 5,
  });

  const token = await signToken({ userId: newTester._id.toString(), mobileNumber, role: 'user' });
  const res = NextResponse.json({ ok: true, userId: newTester._id, newUser: true });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
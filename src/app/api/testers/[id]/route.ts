import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import DeletedProfileLog from '@/models/DeletedProfileLog';
import DeviceUpdateLog from '@/models/DeviceUpdateLog';
import UpdateRequest from '@/models/UpdateRequest';
import { getAuthFromCookies } from '@/lib/auth';

function getDhakaDayKey(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const tester = await TesterProfile.findById(params.id);
  if (!tester || tester.isDeleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  if (auth.role === 'admin') {
    Object.assign(tester, body);
    await tester.save();
    return NextResponse.json(tester);
  }
  if (auth.mobileNumber !== tester.mobileNumber) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const deviceId = req.headers.get('x-device-id') ?? 'unknown';
  const dateKey = getDhakaDayKey();
  const existing = await DeviceUpdateLog.findOne({ deviceId, dateKey });
  if (!existing) {
    Object.assign(tester, body);
    await tester.save();
    await DeviceUpdateLog.create({ deviceId, mobileNumber: auth.mobileNumber, dateKey });
    return NextResponse.json(tester);
  }
  await UpdateRequest.create({
    testerId: tester._id,
    mobileNumber: auth.mobileNumber,
    deviceId,
    proposedChanges: body,
    status: 'pending',
  });
  return NextResponse.json({ pending: true, message: 'Your update request has been submitted for admin approval.' }, { status: 202 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const tester = await TesterProfile.findById(params.id);
  if (!tester) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  tester.isDeleted = true;
  await tester.save();
  await DeletedProfileLog.create({ deletedTesterId: tester._id.toString() });
  return NextResponse.json({ ok: true });
}

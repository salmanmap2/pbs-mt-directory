import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import DeletedProfileLog from '@/models/DeletedProfileLog';
import UpdateRequest from '@/models/UpdateRequest';
import { getAuthFromCookies } from '@/lib/auth';

// Fields users cannot change — stripped before any DB write
const PROTECTED = ['isDeleted', 'isLocked', 'editLimit', 'mobileNumber', '_id',
                   'createdAt', 'updatedAt', '__v', 'seniority'];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const tester = await TesterProfile.findById(params.id);
  if (!tester || tester.isDeleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const rawBody = await req.json();
  // Strip every protected field — must happen before any $set
  PROTECTED.forEach((k) => delete rawBody[k]);

  // Admin — direct update, no limit check
  if (auth.role === 'admin') {
    const updated = await TesterProfile.findByIdAndUpdate(
      params.id,
      { $set: rawBody },
      { new: true, runValidators: true }
    );
    return NextResponse.json(updated);
  }

  // Must be own profile
  if (auth.mobileNumber !== tester.mobileNumber) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const limit: number = typeof tester.editLimit === 'number' ? tester.editLimit : 5;

  if (limit === 0) {
    return NextResponse.json(
      { error: 'Profile locked. No remaining edits. Please contact admin.' },
      { status: 403 }
    );
  }

  const newLimit = limit - 1;

  if (limit > 2) {
    // Direct edit — $set fields, $inc editLimit separately (no overlap)
    const updated = await TesterProfile.findByIdAndUpdate(
      params.id,
      { $set: rawBody, $inc: { editLimit: -1 } },
      { new: true, runValidators: true }
    );
    return NextResponse.json(updated);
  }

  // limit 1 or 2 — approval queue, still decrement
  const deviceId = req.headers.get('x-device-id') ?? 'unknown';
  await TesterProfile.findByIdAndUpdate(params.id, { $inc: { editLimit: -1 } });
  await UpdateRequest.create({
    testerId: tester._id,
    mobileNumber: auth.mobileNumber,
    deviceId,
    proposedChanges: rawBody,
    status: 'pending',
  });
  return NextResponse.json(
    {
      pending: true,
      message: `আপনার পরিবর্তনের অনুরোধ Admin-এর কাছে পাঠানো হয়েছে। অবশিষ্ট Limit: ${newLimit}`,
    },
    { status: 202 }
  );
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
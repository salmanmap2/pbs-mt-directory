import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import { getAuthFromCookies } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Try cookie auth first
  const auth = await getAuthFromCookies();

  // Fallback: check x-admin-key header (sent by AdminPanel after login)
  const adminKey = req.headers.get('x-admin-key');
  const isAdminByKey = adminKey === process.env.ADMIN_PASSWORD;

  if (!isAdminByKey && (!auth || auth.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();

  const tester = await TesterProfile.findById(params.id);
  if (!tester || tester.isDeleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const currentLimit: number = typeof tester.editLimit === 'number' ? tester.editLimit : 5;
  const isCurrentlyLocked = tester.isLocked === true || currentLimit === 0;

  const update = isCurrentlyLocked
    ? { isLocked: false, editLimit: 5 }
    : { isLocked: true,  editLimit: 0 };

  const updated = await TesterProfile.findByIdAndUpdate(
    params.id,
    { $set: update },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({ isLocked: updated.isLocked, editLimit: updated.editLimit });
}
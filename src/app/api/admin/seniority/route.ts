import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import { getAuthFromCookies } from '@/lib/auth';

function isAdminRequest(req: NextRequest, auth: { role: string } | null): boolean {
  if (auth?.role === 'admin') return true;
  const key = req.headers.get('x-admin-key');
  return key === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!isAdminRequest(req, auth)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();

  const all = await TesterProfile.find({ isDeleted: false })
    .sort({ joiningDate: 1, createdAt: 1 })
    .lean();

  return NextResponse.json({
    mt:      all.filter((p) => p.post === 'Meter Tester'),
    officer: all.filter((p) => p.post === 'Officer (Meter Testing)'),
  });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!isAdminRequest(req, auth)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();

  const all = await TesterProfile.find({ isDeleted: false })
    .sort({ joiningDate: 1, createdAt: 1 })
    .lean();

  const mt      = all.filter((p) => p.post === 'Meter Tester');
  const officer = all.filter((p) => p.post === 'Officer (Meter Testing)');

  await Promise.all([
    ...mt.map((p, i) => TesterProfile.updateOne({ _id: p._id }, { $set: { seniority: i + 1 } })),
    ...officer.map((p, i) => TesterProfile.updateOne({ _id: p._id }, { $set: { seniority: i + 1 } })),
  ]);

  return NextResponse.json({ ok: true, mt: mt.length, officer: officer.length });
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PbsPost from '@/models/PbsPost';
import { PBS_LIST } from '@/lib/pbsList';
import { getAuthFromCookies } from '@/lib/auth';

// GET — public
export async function GET() {
  await connectDB();

  // ensure all 80 PBS rows exist
  const existing = await PbsPost.find().lean();
  const existingNames = new Set(existing.map((r) => (r as unknown as { pbsName: string }).pbsName));
  const missing = PBS_LIST.filter((p) => !existingNames.has(p));
  if (missing.length > 0) {
    await PbsPost.insertMany(missing.map((p) => ({ pbsName: p })));
  }

  const all = await PbsPost.find().sort({ pbsName: 1 }).lean();
  return NextResponse.json(all);
}

// PUT — any logged-in user
export async function PUT(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { pbsName, zonalCount, subZonalCount, totalOfficerMT, totalMT, freePost } = await req.json();
  if (!pbsName) return NextResponse.json({ error: 'pbsName required' }, { status: 400 });

  const updated = await PbsPost.findOneAndUpdate(
    { pbsName },
    { $set: { zonalCount, subZonalCount, totalOfficerMT, totalMT, freePost } },
    { new: true, upsert: true }
  );
  return NextResponse.json(updated);
}
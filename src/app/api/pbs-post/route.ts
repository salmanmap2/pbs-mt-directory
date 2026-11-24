import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PbsPost from '@/models/PbsPost';
import { PBS_LIST } from '@/lib/pbsList';

// GET — public
export async function GET() {
  await connectDB();

  const existing = await PbsPost.find().lean();
  const existingNames = new Set(
    existing.map((r) => (r as unknown as { pbsName: string }).pbsName)
  );
  const missing = PBS_LIST.filter((p) => !existingNames.has(p));
  if (missing.length > 0) {
    await PbsPost.insertMany(missing.map((p) => ({ pbsName: p })));
  }

  const all = await PbsPost.find().sort({ pbsName: 1 }).lean();
  return NextResponse.json(all);
}

// PUT — any logged-in user (no cookie check needed, page is behind login)
export async function PUT(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { pbsName, zonalCount, subZonalCount, totalOfficerMT, totalMT, freePost } = body;
  if (!pbsName) return NextResponse.json({ error: 'pbsName required' }, { status: 400 });

  const updated = await PbsPost.findOneAndUpdate(
    { pbsName },
    { $set: { zonalCount: Number(zonalCount) || 0, subZonalCount: Number(subZonalCount) || 0, totalOfficerMT: Number(totalOfficerMT) || 0, totalMT: Number(totalMT) || 0, freePost: Number(freePost) || 0 } },
    { new: true, upsert: true }
  );
  return NextResponse.json(updated);
}
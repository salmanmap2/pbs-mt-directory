import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const rows: Record<string, string>[] = await req.json();
  let inserted = 0, updated = 0;
  for (const row of rows) {
    if (!row.mobileNumber || !row.fullName) continue;
    const existing = await TesterProfile.findOne({ mobileNumber: row.mobileNumber });
    if (existing) {
      await TesterProfile.findByIdAndUpdate(existing._id, { $set: {
        fullName: row.fullName || existing.fullName,
        post: row.post || existing.post,
        pbs: row.pbs || existing.pbs,
        office: row.office || existing.office,
        ownDistrict: row.ownDistrict || existing.ownDistrict,
        whatsappNumber: row.whatsappNumber || existing.whatsappNumber,
        facebookUrl: row.facebookUrl || existing.facebookUrl,
        transferChoice1: row.transferChoice1 ?? existing.transferChoice1,
        transferChoice2: row.transferChoice2 ?? existing.transferChoice2,
        transferChoice3: row.transferChoice3 ?? existing.transferChoice3,
        ...(row.joiningDate ? { joiningDate: new Date(row.joiningDate) } : {}),
      }});
      updated++;
    } else {
      try {
        await TesterProfile.create({
          ...row,
          joiningDate: row.joiningDate ? new Date(row.joiningDate) : new Date(),
          isDeleted: false,
          editLimit: 5,
        });
        inserted++;
      } catch { /* skip duplicate */ }
    }
  }
  return NextResponse.json({ ok: true, inserted, updated });
}
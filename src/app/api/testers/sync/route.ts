import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TesterProfile from '@/models/TesterProfile';
import DeletedProfileLog from '@/models/DeletedProfileLog';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const since = req.nextUrl.searchParams.get('since');
  if (!since) return NextResponse.json({ error: 'Missing since param' }, { status: 400 });
  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) return NextResponse.json({ error: 'Invalid since param' }, { status: 400 });
  await connectDB();
  const updated = await TesterProfile.find({ updatedAt: { $gt: sinceDate }, isDeleted: false }).lean();
  const deletedLogs = await DeletedProfileLog.find({ deletedAt: { $gt: sinceDate } }).lean();
  const deleted = deletedLogs.map((d) => d.deletedTesterId);
  return NextResponse.json({ updated, deleted });
}

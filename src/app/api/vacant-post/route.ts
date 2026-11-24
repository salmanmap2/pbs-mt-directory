import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VacantPost from '@/models/VacantPost';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  await connectDB();
  const rows = await VacantPost.find().sort({ pbs: 1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const body = await req.json();
  if (Array.isArray(body)) {
    const inserted = await VacantPost.insertMany(body);
    return NextResponse.json(inserted, { status: 201 });
  }
  const row = await VacantPost.create(body);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  await VacantPost.deleteMany({});
  return NextResponse.json({ ok: true });
}
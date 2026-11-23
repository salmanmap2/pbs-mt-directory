import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MutualTransfer from '@/models/MutualTransfer';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

// GET — public, all users can read
export async function GET() {
  await connectDB();
  const rows = await MutualTransfer.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(rows);
}

// POST — admin only, single row or bulk (array)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const body = await req.json();
  if (Array.isArray(body)) {
    const inserted = await MutualTransfer.insertMany(body);
    return NextResponse.json(inserted, { status: 201 });
  }
  const row = await MutualTransfer.create(body);
  return NextResponse.json(row, { status: 201 });
}

// DELETE all — admin only (used before bulk re-import)
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  await MutualTransfer.deleteMany({});
  return NextResponse.json({ ok: true });
}
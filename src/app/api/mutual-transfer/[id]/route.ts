import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MutualTransfer from '@/models/MutualTransfer';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const updated = await MutualTransfer.findByIdAndUpdate(params.id, { $set: body }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  await MutualTransfer.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
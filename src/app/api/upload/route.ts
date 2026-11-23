import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const formData = await req.formData();
  const image = formData.get('image') as File | null;
  if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  const bytes = await image.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const key = process.env.IMGBB_API_KEY;
  if (!key) return NextResponse.json({ error: 'ImgBB not configured' }, { status: 500 });
  const form = new FormData();
  form.append('key', key);
  form.append('image', base64);
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  if (!res.ok) return NextResponse.json({ error: 'ImgBB upload failed' }, { status: 502 });
  const data = await res.json();
  return NextResponse.json({ url: data.data.url });
}

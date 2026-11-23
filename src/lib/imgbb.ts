export async function uploadToImgBB(imageBase64: string): Promise<string> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error('IMGBB_API_KEY not set');
  const form = new FormData();
  form.append('key', key);
  form.append('image', imageBase64);
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error('ImgBB upload failed');
  const json = await res.json();
  return json.data.url as string;
}

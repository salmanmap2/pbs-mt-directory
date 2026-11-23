'use client';
import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export function ImageUpload({ name, src, onUpload }: { name: string; src?: string; onUpload: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
      const { url } = await res.json();
      onUpload(url);
    }
  };
  return (
    <div className="relative w-20 h-20 cursor-pointer" onClick={() => ref.current?.click()}>
      <Avatar name={name} src={src} size={80} />
      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Camera size={24} className="text-white" />
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

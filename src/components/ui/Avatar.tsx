'use client';
import Image from 'next/image';

const PALETTE = [
  '#1e3a5f', '#1a3d2b', '#3d1e3a', '#3d2f1e',
  '#1e3d3d', '#3a1e1e', '#2b1e3d', '#1e2b3d',
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return PALETTE[hash % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface Props { name: string; src?: string; size?: number; className?: string; }

export function Avatar({ name, src, size = 40, className = '' }: Props) {
  if (src) {
    return (
      <Image
        src={src} alt={name} width={size} height={size}
        className={`rounded-full object-cover ${className}`}
        style={{width: size, height: size}}
      />
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{width: size, height: size, background: colorFromName(name), fontSize: size * 0.36}}
    >
      {initials(name)}
    </div>
  );
}

'use client';
import { Search, RefreshCw } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSync: () => void;
  syncing: boolean;
}

export function SearchBar({ value, onChange, onSync, syncing }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-bg px-4 py-2 flex items-center gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Search name, PBS, office…"
          className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
        />
      </div>
      <button onClick={onSync} disabled={syncing}
        className="p-2.5 rounded-xl bg-bg-elevated border border-border text-text-secondary hover:text-accent-blue min-h-[44px]">
        <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

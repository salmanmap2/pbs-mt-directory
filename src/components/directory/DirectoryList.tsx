'use client';
import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { TableView } from './TableView';
import { ProfileDetailModal } from './ProfileDetailModal';
import type { TesterProfile } from '@/types';

const SEARCH_FIELDS: (keyof TesterProfile)[] = [
  'fullName','post','pbs','office','ownDistrict','mobileNumber',
  'transferChoice1','transferChoice2','transferChoice3',
];

const SORT_OPTIONS = [
  { value: '',                label: 'Default' },
  { value: 'post',            label: 'Post' },
  { value: 'pbs',             label: 'PBS' },
  { value: 'office',          label: 'Office' },
  { value: 'ownDistrict',     label: 'District' },
  { value: 'joiningDate',     label: 'Joining' },
  { value: 'transferChoice1', label: 'Transfer 1' },
  { value: 'transferChoice2', label: 'Transfer 2' },
  { value: 'transferChoice3', label: 'Transfer 3' },
];

export function DirectoryList({ testers, syncing, onSync }: {
  testers: TesterProfile[]; syncing: boolean; onSync: () => void;
}) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [view, setView] = useState<'list' | 'table'>('list');
  const [selected, setSelected] = useState<TesterProfile | null>(null);

  const filtered = useMemo(() => {
    let list = testers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        SEARCH_FIELDS.some((f) => String(t[f] ?? '').toLowerCase().includes(q))
      );
    }
    if (sort) {
      list = [...list].sort((a, b) =>
        String(a[sort as keyof TesterProfile] ?? '').localeCompare(
          String(b[sort as keyof TesterProfile] ?? '')
        )
      );
    }
    return list;
  }, [testers, search, sort]);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* sticky wrapper — tab + search একসাথে সবসময় উপরে */}
      <div className="sticky top-0 z-30 bg-bg-card border-b border-border">

        {/* Row 1: List / Table tabs */}
        <div className="flex">
          <button onClick={() => setView('list')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              view === 'list'
                ? 'text-accent-blue border-b-2 border-accent-blue'
                : 'text-text-secondary hover:text-text-primary'
            }`}>
            List View
          </button>
          <button onClick={() => setView('table')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              view === 'table'
                ? 'text-accent-blue border-b-2 border-accent-blue'
                : 'text-text-secondary hover:text-text-primary'
            }`}>
            Table View
          </button>
        </div>

        {/* Row 2: Search + Sort + Sync একলাইনে */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-8 pr-2 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-bg-elevated border border-border rounded-lg px-2 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-blue max-w-[110px]">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={onSync} disabled={syncing}
            className="p-2 rounded-lg bg-bg-elevated border border-border text-text-secondary hover:text-accent-blue shrink-0">
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
          </button>
        </div>

      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {view === 'list'
          ? filtered.map((t) => <ProfileCard key={t._id} tester={t} onClick={() => setSelected(t)} />)
          : <TableView testers={filtered} onRowClick={setSelected} />
        }
        {filtered.length === 0 && (
          <div className="text-center text-text-secondary py-16 text-sm">No results found</div>
        )}
      </div>

      {selected && <ProfileDetailModal tester={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
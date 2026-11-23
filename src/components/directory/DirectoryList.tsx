'use client';
import { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { SortSelector } from './SortSelector';
import { ProfileCard } from './ProfileCard';
import { TableView } from './TableView';
import { ProfileDetailModal } from './ProfileDetailModal';
import type { TesterProfile } from '@/types';

const SEARCH_FIELDS: (keyof TesterProfile)[] = ['fullName', 'post', 'pbs', 'office', 'ownDistrict', 'mobileNumber', 'transferChoice1', 'transferChoice2', 'transferChoice3'];

export function DirectoryList({ testers, syncing, onSync }: { testers: TesterProfile[]; syncing: boolean; onSync: () => void }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [view, setView] = useState<'list' | 'table'>('list');
  const [selected, setSelected] = useState<TesterProfile | null>(null);

  const filtered = useMemo(() => {
    let list = testers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => SEARCH_FIELDS.some((f) => String(t[f] ?? '').toLowerCase().includes(q)));
    }
    if (sort) {
      list = [...list].sort((a, b) => String(a[sort as keyof TesterProfile] ?? '').localeCompare(String(b[sort as keyof TesterProfile] ?? '')));
    }
    return list;
  }, [testers, search, sort]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-4 pt-3 pb-1">
        <button onClick={() => setView('list')} className={`flex-1 rounded-xl py-2 text-sm font-semibold border ${
          view === 'list' ? 'bg-accent-blue text-white border-accent-blue' : 'bg-bg-elevated text-text-secondary border-border'
        }`}>List View</button>
        <button onClick={() => setView('table')} className={`flex-1 rounded-xl py-2 text-sm font-semibold border ${
          view === 'table' ? 'bg-accent-blue text-white border-accent-blue' : 'bg-bg-elevated text-text-secondary border-border'
        }`}>Table View</button>
      </div>
      <SearchBar value={search} onChange={setSearch} onSync={onSync} syncing={syncing} />
      <SortSelector value={sort} onChange={setSort} />
      <div className="flex-1 overflow-y-auto">
        {view === 'list' ? (
          filtered.map((t) => <ProfileCard key={t._id} tester={t} onClick={() => setSelected(t)} />)
        ) : (
          <TableView testers={filtered} onRowClick={setSelected} />
        )}
        {filtered.length === 0 && (
          <div className="text-center text-text-secondary py-16 text-sm">No results found</div>
        )}
      </div>
      {selected && <ProfileDetailModal tester={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

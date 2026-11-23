'use client';
import { useState } from 'react';
import { PostBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

type SortCol = keyof TesterProfile;

export function TableView({ testers, onRowClick }: { testers: TesterProfile[]; onRowClick: (t: TesterProfile) => void }) {
  const [sortCol, setSortCol] = useState<SortCol>('fullName');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc((v) => !v);
    else { setSortCol(col); setSortAsc(false); }
  };

  const sorted = [...testers].sort((a, b) => {
    const av = String(a[sortCol] ?? ''); const bv = String(b[sortCol] ?? '');
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const cols: { key: SortCol; label: string }[] = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'post', label: 'Post' },
    { key: 'pbs', label: 'PBS' },
    { key: 'office', label: 'Office' },
    { key: 'ownDistrict', label: 'District' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'transferChoice1', label: 'Transfer 1' },
    { key: 'transferChoice2', label: 'Transfer 2' },
    { key: 'transferChoice3', label: 'Transfer 3' },
  ];

  const Th = ({ col }: { col: typeof cols[0] }) => (
    <th onClick={() => toggleSort(col.key)}
      className={`px-3 py-2 text-left text-xs font-semibold cursor-pointer whitespace-nowrap select-none ${
        sortCol === col.key ? 'text-accent-blue' : 'text-text-secondary'
      } ${col.key === 'fullName' ? 'sticky left-0 bg-bg-card z-10' : ''}`}>
      {col.label} {sortCol === col.key ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full text-sm">
        <thead className="border-b border-border">
          <tr>{cols.map((c) => <Th key={c.key} col={c} />)}</tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <tr key={t._id} onClick={() => onRowClick(t)}
              className="border-b border-border hover:bg-bg-elevated cursor-pointer">
              {cols.map((c, i) => (
                <td key={c.key} className={`px-3 py-2 whitespace-nowrap ${
                  c.key === 'post' ? '' : 'text-text-primary'
                } ${i === 0 ? 'sticky left-0 bg-bg-card z-10 font-medium' : ''}`}>
                  {c.key === 'post' ? <PostBadge post={t.post} /> :
                   c.key === 'joiningDate' ? (t.joiningDate ? new Date(t.joiningDate).toLocaleDateString('en-GB') : '—') :
                   String(t[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

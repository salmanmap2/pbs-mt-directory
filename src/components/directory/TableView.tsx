'use client';
import { useState } from 'react';
import { PostBadge, SeniorityBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

type SortCol = keyof TesterProfile;

export function TableView({ testers, onRowClick }: {
  testers: TesterProfile[]; onRowClick: (t: TesterProfile) => void;
}) {
  const [sortCol, setSortCol] = useState<SortCol>('fullName');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc((v) => !v);
    else { setSortCol(col); setSortAsc(false); }
  };

  const sorted = [...testers].sort((a, b) => {
    const av = String(a[sortCol] ?? '');
    const bv = String(b[sortCol] ?? '');
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const cols: { key: SortCol; label: string }[] = [
    { key: 'fullName',        label: 'Full Name' },
    { key: 'post',            label: 'Post' },
    { key: 'pbs',             label: 'PBS' },
    { key: 'office',          label: 'Office' },
    { key: 'ownDistrict',     label: 'District' },
    { key: 'mobileNumber',    label: 'Mobile' },
    { key: 'joiningDate',     label: 'Joining Date' },
    { key: 'transferChoice1', label: 'Transfer 1' },
    { key: 'transferChoice2', label: 'Transfer 2' },
    { key: 'transferChoice3', label: 'Transfer 3' },
  ];

  return (
    <>
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: #1c1d20; }
        .table-scroll::-webkit-scrollbar-thumb { background: #3b4049; border-radius: 3px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: #4b5260; }
        .table-scroll { scrollbar-color: #3b4049 #1c1d20; scrollbar-width: thin; }
      `}</style>
      {/* outer: fills parent height so scrollbar stays at bottom */}
      <div className="flex flex-col h-full min-h-0">
        <div className="table-scroll overflow-x-auto flex-1 min-h-0">
          <table className="min-w-max w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                {cols.map((c) => (
                  <th key={c.key} onClick={() => toggleSort(c.key)}
                    className={`px-3 py-2.5 text-left text-xs font-semibold cursor-pointer whitespace-nowrap select-none ${
                      sortCol === c.key ? 'text-accent-blue' : 'text-text-secondary'
                    }`}>
                    {c.label}{sortCol === c.key ? (sortAsc ? ' ↑' : ' ↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t._id} onClick={() => onRowClick(t)}
                  className="border-b border-border hover:bg-bg-elevated cursor-pointer">
                  {cols.map((c) => (
                    <td key={c.key} className="px-3 py-2 whitespace-nowrap text-text-primary">
                      {c.key === 'post'
                        ? <div className="flex items-center gap-1.5">
                            <PostBadge post={t.post} />
                            {t.seniority != null && <>
                              <span className="text-text-secondary text-xs">-</span>
                              <SeniorityBadge seniority={t.seniority} />
                            </>}
                          </div>
                        : c.key === 'joiningDate'
                        ? (t.joiningDate ? new Date(t.joiningDate).toLocaleDateString('en-GB') : '—')
                        : String(t[c.key] ?? '—')
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
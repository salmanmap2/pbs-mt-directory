'use client';
import { useEffect, useState } from 'react';
import { ArrowLeftRight, Briefcase } from 'lucide-react';
import { PbsPostTable } from './PbsPostTable';
import type { MutualTransferRow } from '@/types';

type SubTab = 'mutual' | 'vacant';

/* ─── Mutual content ─── */
function MutualContent({ rows }: { rows: MutualTransferRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center">
          <ArrowLeftRight size={26} className="text-accent-blue" />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
          আপনার প্রফাইল update করে পছন্দের PBS select করুন।
          কয়েকদিনের মধ্যেই আমরা AI দিয়ে সম্ভব Mutual মিলিয়ে দেখব এবং তা এখানে প্রকাশ করা হবে।
        </p>
      </div>
    );
  }
  return (
    <div className="pb-4">
      <div className="px-3 pt-3 space-y-2 sm:hidden">
        {rows.map((r) => (
          <div key={r._id} className="bg-bg-card rounded-xl p-3 border border-border">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-sm text-text-primary">{r.name}</p>
                <p className="text-xs text-text-secondary">{r.mobileNumber}</p>
              </div>
              <span className="shrink-0 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                {r.post === 'Meter Tester' ? 'MT' : 'Officer-MT'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="bg-bg-elevated rounded-lg px-2.5 py-1.5">
                <p className="text-text-secondary mb-0.5">District</p>
                <p className="text-text-primary font-medium">{r.ownDistrict}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg px-2.5 py-1.5">
                <p className="text-text-secondary mb-0.5">Working PBS</p>
                <p className="text-text-primary font-medium">{r.workingPbs}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg px-2.5 py-1.5 col-span-2">
                <p className="text-text-secondary mb-0.5">Mutual Possible PBS</p>
                <p className="text-accent-blue font-semibold">{r.mutualPossiblePbs}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto px-3 pt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-text-secondary uppercase tracking-wide">
              <th className="text-left px-3 py-2.5">Name</th>
              <th className="text-left px-3 py-2.5">Mobile</th>
              <th className="text-left px-3 py-2.5">Post</th>
              <th className="text-left px-3 py-2.5">District</th>
              <th className="text-left px-3 py-2.5">Working PBS</th>
              <th className="text-left px-3 py-2.5">Mutual Possible PBS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-b border-border hover:bg-bg-elevated">
                <td className="px-3 py-2.5 font-medium text-text-primary whitespace-nowrap">{r.name}</td>
                <td className="px-3 py-2.5 text-text-secondary">{r.mobileNumber}</td>
                <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{r.post === 'Meter Tester' ? 'MT' : 'Officer-MT'}</td>
                <td className="px-3 py-2.5 text-text-secondary">{r.ownDistrict}</td>
                <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{r.workingPbs}</td>
                <td className="px-3 py-2.5 text-accent-blue font-semibold whitespace-nowrap">{r.mutualPossiblePbs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export function MutualTransferTab() {
  const [subTab, setSubTab]       = useState<SubTab>('mutual');
  const [mutualRows, setMutualRows] = useState<MutualTransferRow[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch('/api/mutual-transfer')
      .then((r) => r.json())
      .then((d) => { setMutualRows(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-secondary text-sm">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-tabs */}
      <div className="sticky top-0 z-30 bg-bg-card border-b border-border flex">
        <button onClick={() => setSubTab('mutual')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            subTab === 'mutual'
              ? 'text-accent-blue border-b-2 border-accent-blue'
              : 'text-text-secondary hover:text-text-primary'
          }`}>
          <ArrowLeftRight size={14} />
          Mutual
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${subTab === 'mutual' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-bg-elevated text-text-secondary'}`}>
            {mutualRows.length}
          </span>
        </button>
        <button onClick={() => setSubTab('vacant')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            subTab === 'vacant'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}>
          <Briefcase size={14} />
          শূন্য পদ
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {subTab === 'mutual' && <MutualContent rows={mutualRows} />}
        {subTab === 'vacant' && <PbsPostTable />}
      </div>
    </div>
  );
}
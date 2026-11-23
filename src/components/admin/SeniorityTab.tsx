'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { TesterProfile } from '@/types';

type PostTab = 'mt' | 'officer';

function SeniorityTable({ profiles }: { profiles: TesterProfile[] }) {
  if (profiles.length === 0) {
    return <div className="text-center text-text-secondary py-10 text-sm">No profiles found.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-text-secondary uppercase tracking-wide">
            <th className="text-left px-3 py-2.5 w-10">SL</th>
            <th className="text-left px-3 py-2.5">Name</th>
            <th className="text-left px-3 py-2.5">PBS</th>
            <th className="text-left px-3 py-2.5 hidden sm:table-cell">Office</th>
            <th className="text-left px-3 py-2.5">Joining</th>
            <th className="text-center px-3 py-2.5 w-16">Rank</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p, i) => (
            <tr key={p._id} className="border-b border-border hover:bg-bg-elevated transition-colors">
              <td className="px-3 py-2.5 text-text-secondary tabular-nums text-xs">{i + 1}</td>
              <td className="px-3 py-2.5 text-text-primary font-medium text-xs whitespace-nowrap">{p.fullName}</td>
              <td className="px-3 py-2.5 text-text-secondary text-xs whitespace-nowrap">{p.pbs}</td>
              <td className="px-3 py-2.5 text-text-secondary text-xs whitespace-nowrap hidden sm:table-cell">{p.office}</td>
              <td className="px-3 py-2.5 text-text-secondary tabular-nums text-xs whitespace-nowrap">
                {p.joiningDate ? new Date(p.joiningDate).toLocaleDateString('en-GB') : '—'}
              </td>
              <td className="px-3 py-2.5 text-center">
                {p.seniority != null ? (
                  <span className="inline-block bg-violet-900/50 text-violet-300 font-bold text-xs px-2 py-0.5 rounded-full tabular-nums">
                    #{p.seniority}
                  </span>
                ) : (
                  <span className="text-text-secondary text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SeniorityTab({ adminKey }: { adminKey: string }) {
  const [mt, setMt] = useState<TesterProfile[]>([]);
  const [officer, setOfficer] = useState<TesterProfile[]>([]);
  const [postTab, setPostTab] = useState<PostTab>('mt');
  const [loading, setLoading] = useState(true);
  const [calibrating, setCalibrating] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/seniority', {
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) {
      const data = await res.json();
      setMt(data.mt ?? []);
      setOfficer(data.officer ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCalibrate = async () => {
    setCalibrating(true);
    setMsg('');
    const res = await fetch('/api/admin/seniority', {
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) {
      const data = await res.json();
      setMsg(`Done — MT: ${data.mt}, Officer-MT: ${data.officer}`);
      await loadData();
    } else {
      setMsg('Calibration failed.');
    }
    setCalibrating(false);
  };

  return (
    <div>
      <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
        <Button onClick={handleCalibrate} disabled={calibrating}>
          {calibrating ? 'Calibrating...' : '⚡ Calibrate Seniority'}
        </Button>
        {msg && <span className="text-xs text-emerald-400">{msg}</span>}
      </div>

      <div className="flex border-b border-border">
        <button onClick={() => setPostTab('mt')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            postTab === 'mt' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-text-secondary'
          }`}>
          Meter Tester
          <span className="ml-1.5 text-xs bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded-full">{mt.length}</span>
        </button>
        <button onClick={() => setPostTab('officer')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            postTab === 'officer' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-text-secondary'
          }`}>
          Officer-MT
          <span className="ml-1.5 text-xs bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded-full">{officer.length}</span>
        </button>
      </div>

      {loading
        ? <div className="text-center text-text-secondary py-10 text-sm">Loading...</div>
        : <SeniorityTable profiles={postTab === 'mt' ? mt : officer} />
      }
    </div>
  );
}
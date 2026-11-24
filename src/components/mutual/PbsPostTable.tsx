'use client';
import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { PBS_LIST } from '@/lib/pbsList';
import type { PbsPostRow } from '@/types';

const NUM = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue text-center tabular-nums";

const EMPTY = { zonalCount: 0, subZonalCount: 0, totalOfficerMT: 0, totalMT: 0, freePost: 0 };

export function PbsPostTable() {
  const [rows, setRows]           = useState<PbsPostRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selPbs, setSelPbs]       = useState('');
  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/pbs-post');
    if (r.ok) setRows(await r.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
    // refresh when window gets focus or tab becomes visible
    const onFocus = () => load();
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // when PBS selected in modal, prefill from existing data
  const handlePbsSelect = (name: string) => {
    setSelPbs(name);
    if (!name) { setForm({ ...EMPTY }); return; }
    const existing = rows.find((r) => r.pbsName === name);
    setForm(existing
      ? { zonalCount: existing.zonalCount, subZonalCount: existing.subZonalCount, totalOfficerMT: existing.totalOfficerMT, totalMT: existing.totalMT, freePost: existing.freePost }
      : { ...EMPTY }
    );
  };

  const handleSave = async () => {
    if (!selPbs) { setMsg('PBS select করুন'); return; }
    setSaving(true); setMsg('');
    const r = await fetch('/api/pbs-post', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pbsName: selPbs, ...form }),
    });
    setSaving(false);
    if (r.ok) { setModalOpen(false); setSelPbs(''); setForm({ ...EMPTY }); load(); }
    else setMsg('Save failed');
  };

  const n = (v: number) => v === 0 ? <span className="text-text-secondary">—</span> : <span>{v}</span>;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Edit button — sticky top */}
      <div className="sticky top-0 z-20 bg-bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-text-secondary tabular-nums">{rows.length} PBS</span>
        <button onClick={() => { setModalOpen(true); setSelPbs(''); setForm({ ...EMPTY }); setMsg(''); }}
          className="flex items-center gap-1.5 bg-accent-blue hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
          <Pencil size={13} /> Edit
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">Loading...</div>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto">
          <style>{`
            .pbs-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
            .pbs-scroll::-webkit-scrollbar-track { background: #1c1d20; }
            .pbs-scroll::-webkit-scrollbar-thumb { background: #3b4049; border-radius: 3px; }
            .pbs-scroll { scrollbar-color: #3b4049 #1c1d20; scrollbar-width: thin; }
          `}</style>
          <div className="pbs-scroll overflow-auto h-full">
            <table className="min-w-max w-full text-sm">
              <thead className="sticky top-0 z-10 bg-bg-card border-b border-border">
                <tr className="text-xs text-text-secondary uppercase tracking-wide">
                  <th className="text-left px-3 py-2.5 whitespace-nowrap">PBS Name</th>
                  <th className="text-center px-3 py-2.5 whitespace-nowrap">Zonal</th>
                  <th className="text-center px-3 py-2.5 whitespace-nowrap">Sub-Zonal</th>
                  <th className="text-center px-3 py-2.5 whitespace-nowrap">Officer-MT</th>
                  <th className="text-center px-3 py-2.5 whitespace-nowrap">MT</th>
                  <th className="text-center px-3 py-2.5 whitespace-nowrap">Free Post</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r._id} className={`border-b border-border hover:bg-bg-elevated ${i % 2 === 0 ? '' : 'bg-bg-card/40'}`}>
                    <td className="px-3 py-2 text-text-primary font-medium whitespace-nowrap">{r.pbsName}</td>
                    <td className="px-3 py-2 text-center text-text-primary tabular-nums">{n(r.zonalCount)}</td>
                    <td className="px-3 py-2 text-center text-text-primary tabular-nums">{n(r.subZonalCount)}</td>
                    <td className="px-3 py-2 text-center text-emerald-400 font-semibold tabular-nums">{n(r.totalOfficerMT)}</td>
                    <td className="px-3 py-2 text-center text-blue-400 font-semibold tabular-nums">{n(r.totalMT)}</td>
                    <td className="px-3 py-2 text-center text-amber-400 font-bold tabular-nums">{n(r.freePost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-20 pt-6"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="w-full max-w-sm bg-bg-card rounded-2xl border border-border overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary">শূন্য পদ আপডেট করুন</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-secondary hover:text-white">
                <X size={18} />
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 space-y-3">
              {/* PBS select */}
              <div>
                <label className="text-xs text-text-secondary mb-1 block">PBS Name *</label>
                <select value={selPbs} onChange={(e) => handlePbsSelect(e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue">
                  <option value="">— PBS বেছে নিন —</option>
                  {PBS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {/* Number fields */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Zonal</label>
                  <input type="number" min={0} value={form.zonalCount} onChange={(e) => setForm({ ...form, zonalCount: +e.target.value || 0 })} className={NUM} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Sub-Zonal</label>
                  <input type="number" min={0} value={form.subZonalCount} onChange={(e) => setForm({ ...form, subZonalCount: +e.target.value || 0 })} className={NUM} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Officer-MT</label>
                  <input type="number" min={0} value={form.totalOfficerMT} onChange={(e) => setForm({ ...form, totalOfficerMT: +e.target.value || 0 })} className={NUM} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">MT</label>
                  <input type="number" min={0} value={form.totalMT} onChange={(e) => setForm({ ...form, totalMT: +e.target.value || 0 })} className={NUM} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-amber-400 mb-1 block font-semibold">Free Post</label>
                  <input type="number" min={0} value={form.freePost} onChange={(e) => setForm({ ...form, freePost: +e.target.value || 0 })}
                    className={NUM + ' border-amber-700/50 focus:border-amber-400'} />
                </div>
              </div>
              {msg && <p className="text-xs text-red-400">{msg}</p>}
              <button onClick={handleSave} disabled={saving || !selPbs}
                className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

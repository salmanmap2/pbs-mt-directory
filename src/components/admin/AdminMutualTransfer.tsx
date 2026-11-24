'use client';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PBS_LIST } from '@/lib/pbsList';
import { DISTRICT_LIST } from '@/lib/districtList';
import type { MutualTransferRow, VacantPostRow } from '@/types';

const SEL = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue";
const INP = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue";

const EMPTY_MUTUAL  = { name: '', mobileNumber: '', post: 'Meter Tester', ownDistrict: '', workingPbs: '', mutualPossiblePbs: '' };
const EMPTY_VACANT  = { pbs: '', office: '', post: 'Meter Tester', vacantCount: 1, note: '' };

type SubTab = 'mutual' | 'vacant';

/* ── Mutual section ── */
function MutualSection({ adminKey }: { adminKey: string }) {
  const [rows, setRows]           = useState<MutualTransferRow[]>([]);
  const [form, setForm]           = useState({ ...EMPTY_MUTUAL });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');
  const H = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  const load = async () => { const r = await fetch('/api/mutual-transfer'); if (r.ok) setRows(await r.json()); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    const url = editingId ? `/api/mutual-transfer/${editingId}` : '/api/mutual-transfer';
    const r = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: H, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) { setForm({ ...EMPTY_MUTUAL }); setEditingId(null); load(); }
    else setMsg('Save failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/mutual-transfer/${id}`, { method: 'DELETE', headers: H });
    load();
  };

  const handlePaste = async () => {
    const lines = pasteText.trim().split('\n').filter(Boolean);
    const parsed = lines.map((l) => {
      const c = l.split('\t');
      return { name: c[0]?.trim() ?? '', mobileNumber: c[1]?.trim() ?? '', post: c[2]?.trim() ?? 'Meter Tester', ownDistrict: c[3]?.trim() ?? '', workingPbs: c[4]?.trim() ?? '', mutualPossiblePbs: c[5]?.trim() ?? '' };
    }).filter((r) => r.name && r.mobileNumber);
    if (!parsed.length) { setMsg('No valid rows'); return; }
    setSaving(true);
    const r = await fetch('/api/mutual-transfer', { method: 'POST', headers: H, body: JSON.stringify(parsed) });
    setSaving(false);
    if (r.ok) { setPasteText(''); setPasteMode(false); setMsg(`${parsed.length} rows imported`); load(); }
    else setMsg('Import failed');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit Row' : 'Add Mutual Row'}</h3>
        <input className={INP} placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={INP} placeholder="Mobile *" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
        <select className={SEL} value={form.post} onChange={(e) => setForm({ ...form, post: e.target.value })}>
          <option value="Meter Tester">Meter Tester</option>
          <option value="Officer (Meter Testing)">Officer (Meter Testing)</option>
        </select>
        <select className={SEL} value={form.ownDistrict} onChange={(e) => setForm({ ...form, ownDistrict: e.target.value })}>
          <option value="">— Own District —</option>
          {DISTRICT_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className={SEL} value={form.workingPbs} onChange={(e) => setForm({ ...form, workingPbs: e.target.value })}>
          <option value="">— Working PBS —</option>
          {PBS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className={SEL} value={form.mutualPossiblePbs} onChange={(e) => setForm({ ...form, mutualPossiblePbs: e.target.value })}>
          <option value="">— Mutual Possible PBS —</option>
          {PBS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        <div className="flex gap-2">
          {editingId && <Button variant="secondary" onClick={() => { setForm({ ...EMPTY_MUTUAL }); setEditingId(null); }} className="flex-1">Cancel</Button>}
          <Button onClick={handleSave} disabled={saving} className="flex-1"><Plus size={14} className="mr-1" />{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</Button>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <button onClick={() => setPasteMode(!pasteMode)} className="flex items-center gap-2 text-sm font-semibold text-accent-blue">
          <Upload size={14} /> Paste from Google Sheet
        </button>
        {pasteMode && (
          <>
            <p className="text-xs text-text-secondary">Column order: <span className="text-text-primary">Name | Mobile | Post | District | Working PBS | Mutual PBS</span></p>
            <textarea className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-xs text-text-primary h-24 font-mono focus:outline-none" placeholder="Paste here..." value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
            <Button onClick={handlePaste} disabled={saving || !pasteText.trim()} fullWidth>{saving ? 'Importing...' : 'Import'}</Button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{rows.length} rows</span>
        {rows.length > 0 && <button onClick={async () => { if (!confirm('Delete ALL?')) return; await fetch('/api/mutual-transfer', { method: 'DELETE', headers: H }); load(); }} className="text-xs text-red-400">Delete All</button>}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r._id} className="bg-bg-card rounded-xl p-3 border border-border flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-primary">{r.name}</p>
              <p className="text-xs text-text-secondary">{r.mobileNumber} · {r.post === 'Meter Tester' ? 'MT' : 'Officer-MT'}</p>
              <p className="text-xs text-text-secondary mt-0.5">{r.ownDistrict} · {r.workingPbs}</p>
              <p className="text-xs text-accent-blue font-medium mt-0.5">→ {r.mutualPossiblePbs}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setForm({ name: r.name, mobileNumber: r.mobileNumber, post: r.post, ownDistrict: r.ownDistrict, workingPbs: r.workingPbs, mutualPossiblePbs: r.mutualPossiblePbs }); setEditingId(r._id); }} className="text-xs text-text-secondary bg-bg-elevated px-2 py-1 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(r._id)} className="text-red-400 bg-bg-elevated p-1.5 rounded-lg"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Vacant Post section ── */
function VacantSection({ adminKey }: { adminKey: string }) {
  const [rows, setRows]           = useState<VacantPostRow[]>([]);
  const [form, setForm]           = useState({ ...EMPTY_VACANT });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');
  const H = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  const load = async () => { const r = await fetch('/api/vacant-post'); if (r.ok) setRows(await r.json()); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    const url = editingId ? `/api/vacant-post/${editingId}` : '/api/vacant-post';
    const r = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: H, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) { setForm({ ...EMPTY_VACANT }); setEditingId(null); load(); }
    else setMsg('Save failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/vacant-post/${id}`, { method: 'DELETE', headers: H });
    load();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit' : 'Add শূন্য পদ'}</h3>
        <select className={SEL} value={form.pbs} onChange={(e) => setForm({ ...form, pbs: e.target.value })}>
          <option value="">— PBS —</option>
          {PBS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input className={INP} placeholder="Office *" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
        <select className={SEL} value={form.post} onChange={(e) => setForm({ ...form, post: e.target.value })}>
          <option value="Meter Tester">Meter Tester</option>
          <option value="Officer (Meter Testing)">Officer (Meter Testing)</option>
        </select>
        <div>
          <label className="text-xs text-text-secondary">শূন্য পদ সংখ্যা</label>
          <input type="number" min={1} className={INP + ' mt-1'} value={form.vacantCount} onChange={(e) => setForm({ ...form, vacantCount: parseInt(e.target.value) || 1 })} />
        </div>
        <input className={INP} placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        {msg && <p className="text-xs text-red-400">{msg}</p>}
        <div className="flex gap-2">
          {editingId && <Button variant="secondary" onClick={() => { setForm({ ...EMPTY_VACANT }); setEditingId(null); }} className="flex-1">Cancel</Button>}
          <Button onClick={handleSave} disabled={saving} className="flex-1"><Plus size={14} className="mr-1" />{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{rows.length} entries</span>
        {rows.length > 0 && <button onClick={async () => { if (!confirm('Delete ALL?')) return; await fetch('/api/vacant-post', { method: 'DELETE', headers: H }); load(); }} className="text-xs text-red-400">Delete All</button>}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r._id} className="bg-bg-card rounded-xl p-3 border border-border flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-primary">{r.pbs}</p>
              <p className="text-xs text-text-secondary">{r.office} · {r.post === 'Meter Tester' ? 'MT' : 'Officer-MT'}</p>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">শূন্য পদ: {r.vacantCount}</p>
              {r.note && <p className="text-xs text-text-secondary mt-0.5">{r.note}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setForm({ pbs: r.pbs, office: r.office, post: r.post, vacantCount: r.vacantCount, note: r.note ?? '' }); setEditingId(r._id); }} className="text-xs text-text-secondary bg-bg-elevated px-2 py-1 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(r._id)} className="text-red-400 bg-bg-elevated p-1.5 rounded-lg"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ── */
export function AdminMutualTransfer({ adminKey }: { adminKey: string }) {
  const [subTab, setSubTab] = useState<SubTab>('mutual');
  return (
    <div>
      <div className="flex border-b border-border">
        <button onClick={() => setSubTab('mutual')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${subTab === 'mutual' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-text-secondary'}`}>
          Mutual
        </button>
        <button onClick={() => setSubTab('vacant')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${subTab === 'vacant' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-text-secondary'}`}>
          শূন্য পদ
        </button>
      </div>
      {subTab === 'mutual' && <MutualSection adminKey={adminKey} />}
      {subTab === 'vacant' && <VacantSection adminKey={adminKey} />}
    </div>
  );
}
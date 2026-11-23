'use client';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PBS_LIST } from '@/lib/pbsList';
import { DISTRICT_LIST } from '@/lib/districtList';
import type { MutualTransferRow } from '@/types';

const EMPTY_ROW = { name: '', mobileNumber: '', post: 'Meter Tester', ownDistrict: '', workingPbs: '', mutualPossiblePbs: '' };
const SEL = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue";
const INP = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue";

export function AdminMutualTransfer({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<MutualTransferRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY_ROW });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  const load = async () => {
    const r = await fetch('/api/mutual-transfer');
    if (r.ok) setRows(await r.json());
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    const url = editingId ? `/api/mutual-transfer/${editingId}` : '/api/mutual-transfer';
    const method = editingId ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) { setForm({ ...EMPTY_ROW }); setEditingId(null); load(); }
    else setMsg('Save failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this row?')) return;
    await fetch(`/api/mutual-transfer/${id}`, { method: 'DELETE', headers });
    load();
  };

  // Parse Google Sheet paste (tab-separated)
  // Expected columns: Name, Mobile, Post, District, Working PBS, Mutual Possible PBS
  const handlePasteImport = async () => {
    const lines = pasteText.trim().split('\n').filter(Boolean);
    const parsed = lines.map((line) => {
      const cols = line.split('\t');
      return {
        name: cols[0]?.trim() ?? '',
        mobileNumber: cols[1]?.trim() ?? '',
        post: cols[2]?.trim() ?? 'Meter Tester',
        ownDistrict: cols[3]?.trim() ?? '',
        workingPbs: cols[4]?.trim() ?? '',
        mutualPossiblePbs: cols[5]?.trim() ?? '',
      };
    }).filter((r) => r.name && r.mobileNumber);

    if (parsed.length === 0) { setMsg('No valid rows found. Check format.'); return; }
    setSaving(true); setMsg('');
    const r = await fetch('/api/mutual-transfer', { method: 'POST', headers, body: JSON.stringify(parsed) });
    setSaving(false);
    if (r.ok) { setPasteText(''); setPasteMode(false); setMsg(`${parsed.length} rows imported`); load(); }
    else setMsg('Import failed');
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL mutual transfer rows?')) return;
    await fetch('/api/mutual-transfer', { method: 'DELETE', headers });
    load();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Add / Edit form */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <h3 className="text-sm font-bold text-text-primary">{editingId ? 'Edit Row' : 'Add New Row'}</h3>
        <div className="grid grid-cols-1 gap-2.5">
          <input className={INP} placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={INP} placeholder="Mobile Number *" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
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
        </div>
        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        <div className="flex gap-2">
          {editingId && (
            <Button variant="secondary" onClick={() => { setForm({ ...EMPTY_ROW }); setEditingId(null); }} className="flex-1">Cancel</Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Plus size={14} className="mr-1" />{saving ? 'Saving...' : editingId ? 'Update' : 'Add Row'}
          </Button>
        </div>
      </div>

      {/* Paste from Google Sheet */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <button onClick={() => setPasteMode(!pasteMode)} className="flex items-center gap-2 text-sm font-semibold text-accent-blue">
          <Upload size={14} /> Paste from Google Sheet
        </button>
        {pasteMode && (
          <>
            <p className="text-xs text-text-secondary">
              Google Sheet থেকে copy করুন। Column order:<br />
              <span className="text-text-primary">Name | Mobile | Post | District | Working PBS | Mutual PBS</span>
            </p>
            <textarea
              className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-blue h-28 font-mono"
              placeholder="Paste tab-separated data here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <Button onClick={handlePasteImport} disabled={saving || !pasteText.trim()} fullWidth>
              {saving ? 'Importing...' : 'Import Rows'}
            </Button>
          </>
        )}
      </div>

      {/* Existing rows */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{rows.length} rows</span>
        {rows.length > 0 && (
          <button onClick={handleDeleteAll} className="text-xs text-red-400 hover:text-red-300">Delete All</button>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r._id} className="bg-bg-card rounded-xl p-3 border border-border">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text-primary">{r.name}</p>
                <p className="text-xs text-text-secondary">{r.mobileNumber} · {r.post === 'Meter Tester' ? 'MT' : 'Officer-MT'}</p>
                <p className="text-xs text-text-secondary mt-0.5">{r.ownDistrict} · {r.workingPbs}</p>
                <p className="text-xs text-accent-blue font-medium mt-0.5">→ {r.mutualPossiblePbs}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setForm({ name: r.name, mobileNumber: r.mobileNumber, post: r.post, ownDistrict: r.ownDistrict, workingPbs: r.workingPbs, mutualPossiblePbs: r.mutualPossiblePbs }); setEditingId(r._id); }}
                  className="text-xs text-text-secondary hover:text-white bg-bg-elevated px-2 py-1 rounded-lg">Edit</button>
                <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-300 bg-bg-elevated p-1.5 rounded-lg">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
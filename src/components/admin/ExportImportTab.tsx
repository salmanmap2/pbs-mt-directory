'use client';
import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function toCsv(data: Record<string, unknown>[]): string {
  if (!data.length) return '';
  const COLS = ['fullName','post','pbs','office','ownDistrict','mobileNumber',
    'whatsappNumber','facebookUrl','joiningDate','transferChoice1','transferChoice2',
    'transferChoice3','seniority','editLimit','isLocked'];
  const header = COLS.join(',');
  const rows = data.map((r) =>
    COLS.map((c) => {
      const v = r[c] ?? '';
      const s = String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

export function ExportImportTab({ adminKey }: { adminKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleExport = async () => {
    setMsg('');
    const r = await fetch('/api/admin/export', { headers: { 'x-admin-key': adminKey } });
    if (!r.ok) { setMsg('Export failed'); return; }
    const data = await r.json();
    const csv = toCsv(data);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pbs_testers_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg(`Exported ${data.length} profiles`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setMsg('');
    const text = await file.text();
    const lines = text.split('\n').filter(Boolean);
    if (lines.length < 2) { setMsg('File is empty'); setImporting(false); return; }
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    }).filter((r) => r.fullName && r.mobileNumber);

    const r = await fetch('/api/admin/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(rows),
    });
    setImporting(false);
    if (r.ok) { const d = await r.json(); setMsg(`Imported: ${d.inserted} new, ${d.updated} updated`); }
    else { const d = await r.json().catch(() => ({})); setMsg(d.error ?? 'Import failed'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Export */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-text-primary">Export to Excel / CSV</h3>
        </div>
        <p className="text-xs text-text-secondary">সব active profile CSV ফাইলে download হবে। Excel-এ সরাসরি open করা যাবে।</p>
        <Button onClick={handleExport} fullWidth>
          <Download size={14} className="mr-2" /> Export All Profiles
        </Button>
      </div>

      {/* Import */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Upload size={16} className="text-accent-blue" />
          <h3 className="text-sm font-bold text-text-primary">Import from CSV</h3>
        </div>
        <p className="text-xs text-text-secondary">
          Export করা CSV edit করে আবার import করুন।<br />
          <span className="text-amber-400">Mobile number দিয়ে match — নতুন হলে add, থাকলে update।</span>
        </p>
        <Button onClick={() => fileRef.current?.click()} disabled={importing} fullWidth>
          <Upload size={14} className="mr-2" /> {importing ? 'Importing...' : 'Select CSV File'}
        </Button>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
      </div>

      {msg && (
        <div className="bg-bg-elevated rounded-xl px-4 py-3 text-sm text-emerald-400 border border-emerald-800/40">
          {msg}
        </div>
      )}
    </div>
  );
}
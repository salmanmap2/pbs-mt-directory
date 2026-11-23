'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { PBS_LIST } from '@/lib/pbsList';
import { DISTRICT_LIST } from '@/lib/districtList';
import type { TesterProfile } from '@/types';

const INPUT_STYLE = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none focus:border-accent-blue";

const EMPTY: Partial<TesterProfile> = {
  fullName: '', post: 'Meter Tester', pbs: '', office: '', ownDistrict: '',
  mobileNumber: '', whatsappNumber: '', facebookUrl: '',
  transferChoice1: '', transferChoice2: '', transferChoice3: '',
  joiningDate: '', profilePic: '',
};

function PBSSelect({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-secondary">{label}{required && ' *'}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT_STYLE}>
        <option value="">{placeholder ?? 'â€” Select PBS â€”'}</option>
        {PBS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}

function DistrictSelect({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-text-secondary">{label}{required && ' *'}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT_STYLE}>
        <option value="">â€” Select District â€”</option>
        {DISTRICT_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}

export function AddEditTesterForm({ initial, onSaved, onCancel }: {
  initial?: TesterProfile;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<TesterProfile>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (key: keyof TesterProfile) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setSaving(true);
    setErr('');
    const url = initial ? `/api/testers/${initial._id}` : '/api/testers';
    const method = initial ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else { const d = await res.json(); setErr(d.error ?? 'Failed'); }
  };

  const textField = (key: keyof TesterProfile, label: string, type = 'text') => (
    <div key={key}>
      <label className="text-xs text-text-secondary">{label}</label>
      <input type={type} value={String(form[key] ?? '')}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={INPUT_STYLE} />
    </div>
  );

  return (
    <div className="space-y-3 p-4">
      <div className="flex justify-center">
        <ImageUpload
          name={form.fullName ?? 'New'}
          src={form.profilePic}
          onUpload={(url) => setForm((f) => ({ ...f, profilePic: url }))}
        />
      </div>

      {textField('fullName', 'Full Name *')}

      <div>
        <label className="text-xs text-text-secondary">Post *</label>
        <select value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value as TesterProfile['post'] }))} className={INPUT_STYLE}>
          <option value="Meter Tester">Meter Tester</option>
          <option value="Officer (Meter Testing)">Officer (Meter Testing)</option>
        </select>
      </div>

      <PBSSelect label="PBS" value={form.pbs ?? ''} onChange={set('pbs')} required />

      {textField('office', 'Office *')}

      <DistrictSelect label="Home District" value={form.ownDistrict ?? ''} onChange={set('ownDistrict')} required />

      {textField('mobileNumber', 'Mobile Number *')}
      {textField('whatsappNumber', 'WhatsApp Number')}
      {textField('facebookUrl', 'Facebook URL')}
      {textField('joiningDate', 'Joining Date *', 'date')}

      <PBSSelect label="Transfer Choice 1" value={form.transferChoice1 ?? ''} onChange={set('transferChoice1')} placeholder="â€” None â€”" />
      <PBSSelect label="Transfer Choice 2" value={form.transferChoice2 ?? ''} onChange={set('transferChoice2')} placeholder="â€” None â€”" />
      <PBSSelect label="Transfer Choice 3" value={form.transferChoice3 ?? ''} onChange={set('transferChoice3')} placeholder="â€” None â€”" />

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving} className="flex-1">
          {saving ? 'Saving...' : initial ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { PBS_LIST } from '@/lib/pbsList';
import { DISTRICT_LIST } from '@/lib/districtList';
import type { TesterProfile } from '@/types';

const SELECT_STYLE = "w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none focus:border-accent-blue";

function PBSSelect({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-secondary">{label}{required && ' *'}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_STYLE}>
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
      <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_STYLE}>
        <option value="">â€” Select District â€”</option>
        {DISTRICT_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}

export function EditProfileForm({ profile, deviceId, onSaved, onCancel }: {
  profile: TesterProfile;
  deviceId: string;
  onSaved: (p: TesterProfile | null, pending: boolean) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (key: keyof TesterProfile) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setSaving(true);
    setMsg('');
    const res = await fetch(`/api/testers/${profile._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-device-id': deviceId },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.status === 202) {
      const data = await res.json();
      setMsg(data.message);
      onSaved(null, true);
    } else if (res.ok) {
      onSaved(await res.json(), false);
    } else {
      const err = await res.json();
      setMsg(err.error ?? 'Save failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ImageUpload
          name={form.fullName}
          src={form.profilePic}
          onUpload={(url) => setForm((f) => ({ ...f, profilePic: url }))}
        />
      </div>

      <div>
        <label className="text-xs text-text-secondary">Post *</label>
        <select value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value as TesterProfile['post'] }))} className={SELECT_STYLE}>
          <option value="Meter Tester">Meter Tester</option>
          <option value="Officer (Meter Testing)">Officer (Meter Testing)</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-text-secondary">Full Name *</label>
        <input type="text" value={form.fullName} onChange={(e) => set('fullName')(e.target.value)} className={SELECT_STYLE} />
      </div>

      <PBSSelect label="PBS" value={form.pbs} onChange={set('pbs')} required />

      <div>
        <label className="text-xs text-text-secondary">Office *</label>
        <input type="text" value={form.office} onChange={(e) => set('office')(e.target.value)} className={SELECT_STYLE} />
      </div>

      <DistrictSelect label="Home District" value={form.ownDistrict} onChange={set('ownDistrict')} required />

      <div>
        <label className="text-xs text-text-secondary">WhatsApp Number</label>
        <input type="text" value={form.whatsappNumber ?? ''} onChange={(e) => set('whatsappNumber')(e.target.value)} className={SELECT_STYLE} />
      </div>

      <div>
        <label className="text-xs text-text-secondary">Facebook URL</label>
        <input type="text" value={form.facebookUrl ?? ''} onChange={(e) => set('facebookUrl')(e.target.value)} className={SELECT_STYLE} />
      </div>

      <div>
        <label className="text-xs text-text-secondary">Joining Date *</label>
        <input type="date"
          value={form.joiningDate ? form.joiningDate.toString().slice(0, 10) : ''}
          onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
          className={SELECT_STYLE} />
      </div>

      <PBSSelect label="Transfer Choice 1" value={form.transferChoice1 ?? ''} onChange={set('transferChoice1')} placeholder="â€” None â€”" />
      <PBSSelect label="Transfer Choice 2" value={form.transferChoice2 ?? ''} onChange={set('transferChoice2')} placeholder="â€” None â€”" />
      <PBSSelect label="Transfer Choice 3" value={form.transferChoice3 ?? ''} onChange={set('transferChoice3')} placeholder="â€” None â€”" />

      {msg && <p className="text-sm text-blue-400 bg-blue-900/30 rounded-xl p-3">{msg}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving} className="flex-1">
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import type { TesterProfile } from '@/types';

const TEXT_FIELDS: { key: keyof TesterProfile; label: string; required?: boolean }[] = [
  { key: 'fullName', label: 'Full Name', required: true },
  { key: 'pbs', label: 'PBS', required: true },
  { key: 'office', label: 'Office', required: true },
  { key: 'ownDistrict', label: 'Home District', required: true },
  { key: 'whatsappNumber', label: 'WhatsApp Number' },
  { key: 'facebookUrl', label: 'Facebook URL' },
  { key: 'transferChoice1', label: 'Transfer Choice 1' },
  { key: 'transferChoice2', label: 'Transfer Choice 2' },
  { key: 'transferChoice3', label: 'Transfer Choice 3' },
];

export function EditProfileForm({ profile, deviceId, onSaved, onCancel }:
  { profile: TesterProfile; deviceId: string; onSaved: (p: TesterProfile | null, pending: boolean) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

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
      const updated = await res.json();
      onSaved(updated, false);
    } else {
      const err = await res.json();
      setMsg(err.error ?? 'Save failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ImageUpload name={form.fullName} src={form.profilePic} onUpload={(url) => setForm((f) => ({ ...f, profilePic: url }))} />
      </div>
      <div>
        <label className="text-xs text-text-secondary">Post</label>
        <select value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value as TesterProfile['post'] }))}
          className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none">
          <option value="Meter Tester">Meter Tester</option>
          <option value="Meter Testing Supervisor">Meter Testing Supervisor</option>
        </select>
      </div>
      {TEXT_FIELDS.map(({ key, label, required }) => (
        <div key={key}>
          <label className="text-xs text-text-secondary">{label}{required && ' *'}</label>
          <input type="text" value={String(form[key] ?? '')} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none focus:border-accent-blue" />
        </div>
      ))}
      <div>
        <label className="text-xs text-text-secondary">Joining Date *</label>
        <input type="date" value={form.joiningDate ? form.joiningDate.toString().slice(0, 10) : ''}
          onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
          className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none focus:border-accent-blue" />
      </div>
      {msg && <p className="text-sm text-blue-400 bg-blue-900/30 rounded-xl p-3">{msg}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/profile/ImageUpload';
import type { TesterProfile } from '@/types';

const EMPTY: Partial<TesterProfile> = {
  fullName: '', post: 'Meter Tester', pbs: '', office: '', ownDistrict: '',
  mobileNumber: '', whatsappNumber: '', facebookUrl: '',
  transferChoice1: '', transferChoice2: '', transferChoice3: '', joiningDate: '', profilePic: '',
};

export function AddEditTesterForm({ initial, onSaved, onCancel }:
  { initial?: TesterProfile; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<TesterProfile>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    setSaving(true); setErr('');
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

  const F = (key: keyof TesterProfile, label: string, type = 'text') => (
    <div key={key}>
      <label className="text-xs text-text-secondary">{label}</label>
      <input type={type} value={String(form[key] ?? '')}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none focus:border-accent-blue" />
    </div>
  );

  return (
    <div className="space-y-3 p-4">
      <div className="flex justify-center">
        <ImageUpload name={form.fullName ?? 'New'} src={form.profilePic} onUpload={(url) => setForm((f) => ({ ...f, profilePic: url }))} />
      </div>
      {F('fullName', 'Full Name *')}
      <div>
        <label className="text-xs text-text-secondary">Post *</label>
        <select value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value as TesterProfile['post'] }))}
          className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary mt-1 focus:outline-none">
          <option value="Meter Tester">Meter Tester</option>
          <option value="Meter Testing Supervisor">Meter Testing Supervisor</option>
        </select>
      </div>
      {F('pbs', 'PBS *')}
      {F('office', 'Office *')}
      {F('ownDistrict', 'Home District *')}
      {F('mobileNumber', 'Mobile Number *')}
      {F('whatsappNumber', 'WhatsApp Number')}
      {F('facebookUrl', 'Facebook URL')}
      {F('joiningDate', 'Joining Date', 'date')}
      {F('transferChoice1', 'Transfer Choice 1')}
      {F('transferChoice2', 'Transfer Choice 2')}
      {F('transferChoice3', 'Transfer Choice 3')}
      {err && <p className="text-sm text-red-400">{err}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving} className="flex-1">{saving ? 'Saving…' : initial ? 'Update' : 'Add'}</Button>
      </div>
    </div>
  );
}

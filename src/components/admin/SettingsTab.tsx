'use client';
import { useEffect, useState } from 'react';
import { UserPlus, ToggleLeft, ToggleRight } from 'lucide-react';

export function SettingsTab({ adminKey }: { adminKey: string }) {
  const [regOpen, setRegOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => { setRegOpen(d.newUserRegistration ?? false); setLoading(false); });
  }, []);

  const handleToggle = async () => {
    setSaving(true); setMsg('');
    const next = !regOpen;
    const r = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ newUserRegistration: next }),
    });
    setSaving(false);
    if (r.ok) {
      setRegOpen(next);
      setMsg(next ? 'Registration চালু করা হয়েছে' : 'Registration বন্ধ করা হয়েছে');
    } else {
      setMsg('Failed to update');
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary text-sm">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <UserPlus size={18} className="text-accent-blue shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-text-primary">New User Registration</p>
            <p className="text-xs text-text-secondary mt-0.5">
              চালু থাকলে নতুন মোবাইল নম্বর দিয়েও login/register করা যাবে
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <span className={`text-sm font-semibold ${regOpen ? 'text-emerald-400' : 'text-text-secondary'}`}>
              {regOpen ? '✅ Registration চালু আছে' : '🔒 Registration বন্ধ আছে'}
            </span>
            <p className="text-xs text-text-secondary mt-1">
              {regOpen
                ? 'যেকোনো ১১ ডিজিটের নম্বর দিয়ে নতুন account তৈরি হবে'
                : 'শুধু registered মোবাইল নম্বর দিয়ে login করা যাবে'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`shrink-0 transition-colors disabled:opacity-50 ${regOpen ? 'text-emerald-400' : 'text-text-secondary'}`}
          >
            {regOpen
              ? <ToggleRight size={44} strokeWidth={1.5} />
              : <ToggleLeft  size={44} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Warning when open */}
        {regOpen && (
          <div className="mx-4 mb-4 bg-amber-900/20 border border-amber-700/40 rounded-xl px-3 py-2.5">
            <p className="text-xs text-amber-400">
              ⚠️ Registration চালু থাকলে নতুন user-এর profile-এ placeholder data থাকবে।
              তাদের নিজেরা edit করতে বলুন অথবা Admin থেকে update করুন।
            </p>
          </div>
        )}
      </div>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${
          msg.includes('Failed')
            ? 'bg-red-900/20 border-red-700/40 text-red-400'
            : 'bg-emerald-900/20 border-emerald-700/40 text-emerald-400'
        }`}>
          {msg}
        </div>
      )}
    </div>
  );
}
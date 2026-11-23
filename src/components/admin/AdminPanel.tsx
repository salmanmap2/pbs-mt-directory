'use client';
import { useEffect, useState } from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge } from '@/components/ui/Badge';
import { AddEditTesterForm } from './AddEditTesterForm';
import { UpdateRequestList } from './UpdateRequestList';
import { SeniorityTab } from './SeniorityTab';
import { ExportImportTab } from './ExportImportTab';
import { SettingsTab } from './SettingsTab';
import { AdminMutualTransfer } from './AdminMutualTransfer';
import type { TesterProfile } from '@/types';

type AdminTab = 'profiles' | 'requests' | 'seniority' | 'export' | 'mutual' | 'settings';

function AdminLogin({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); setErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) onLogin(password);
    else setErr('Invalid credentials');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="w-full max-w-sm bg-bg-card rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-text-primary text-center">Admin Login</h2>
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <Button fullWidth onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}

function LimitBadge({ limit }: { limit: number }) {
  const cls =
    limit === 0 ? 'bg-red-900/50 text-red-400 border border-red-700/40' :
    limit <= 2  ? 'bg-amber-900/50 text-amber-400 border border-amber-700/40' :
                  'bg-green-900/50 text-green-400 border border-green-700/40';
  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded tabular-nums ${cls}`}>{limit}</span>;
}

export function AdminPanel({ isAdmin, onAdminLogin }: { isAdmin: boolean; onAdminLogin: () => void }) {
  const [tab, setTab] = useState<AdminTab>('profiles');
  const [testers, setTesters] = useState<TesterProfile[]>([]);
  const [editing, setEditing] = useState<TesterProfile | null | 'new'>(null);
  const [lockingId, setLockingId] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');

  const loadTesters = async () => {
    const res = await fetch('/api/testers');
    if (res.ok) setTesters(await res.json());
  };

  useEffect(() => { if (isAdmin) loadTesters(); }, [isAdmin]);

  const handleAdminLogin = (pwd: string) => { setAdminKey(pwd); onAdminLogin(); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return;
    await fetch(`/api/testers/${id}`, { method: 'DELETE' });
    loadTesters();
  };

  const handleToggleLock = async (t: TesterProfile) => {
    setLockingId(t._id);
    const res = await fetch(`/api/testers/${t._id}/lock`, {
      method: 'PATCH',
      headers: { 'x-admin-key': adminKey },
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); alert(e.error ?? 'Failed'); }
    setLockingId(null);
    await loadTesters();
  };

  if (!isAdmin) return <AdminLogin onLogin={handleAdminLogin} />;

  if (editing) return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">{editing === 'new' ? 'Add Tester' : 'Edit Tester'}</h2>
      <AddEditTesterForm
        initial={editing !== 'new' ? editing : undefined}
        onSaved={() => { setEditing(null); loadTesters(); }}
        onCancel={() => setEditing(null)}
      />
    </div>
  );

  const TABS: { id: AdminTab; label: string }[] = [
    { id: 'profiles',  label: 'Profiles' },
    { id: 'requests',  label: 'Pending' },
    { id: 'seniority', label: 'Seniority' },
    { id: 'mutual',    label: 'Mutual' },
    { id: 'export',    label: 'Export' },
    { id: 'settings',  label: 'Settings' },
  ];

  return (
    <div>
      <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-shrink-0 py-3 text-xs font-semibold px-3 transition-colors ${
              tab === id ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-text-secondary hover:text-text-primary'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profiles' && (
        <div>
          <div className="p-4"><Button fullWidth onClick={() => setEditing('new')}>+ Add New Tester</Button></div>
          {testers.map((t) => {
            const limit = typeof t.editLimit === 'number' ? t.editLimit : 5;
            const locked = t.isLocked === true || limit === 0;
            return (
              <div key={t._id} className="flex items-center gap-2.5 px-3 py-3 border-b border-border">
                <Avatar name={t.fullName} src={t.profilePic} size={38} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-sm text-text-primary truncate">{t.fullName}</span>
                    <PostBadge post={t.post} />
                  </div>
                  <div className="text-xs text-text-secondary truncate">{t.pbs} Â· {t.office}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <LimitBadge limit={limit} />
                  <button onClick={() => handleToggleLock(t)} disabled={lockingId === t._id}
                    title={locked ? 'Unlock' : 'Lock'}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${locked ? 'text-amber-400 bg-amber-900/20' : 'text-text-secondary hover:text-amber-400 hover:bg-bg-elevated'}`}>
                    {locked ? <Lock size={15} /> : <LockOpen size={15} />}
                  </button>
                  <Button variant="ghost" onClick={() => setEditing(t)} className="text-xs px-2 py-1 min-h-0">Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(t._id)} className="text-xs px-2 py-1 min-h-0">Del</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab === 'requests'  && <UpdateRequestList />}
      {tab === 'seniority' && <SeniorityTab adminKey={adminKey} />}
      {tab === 'mutual'    && <AdminMutualTransfer adminKey={adminKey} />}
      {tab === 'export'    && <ExportImportTab adminKey={adminKey} />}
      {tab === 'settings'  && <SettingsTab adminKey={adminKey} />}
    </div>
  );
}
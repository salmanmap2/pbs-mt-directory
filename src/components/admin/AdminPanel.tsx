'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge } from '@/components/ui/Badge';
import { AddEditTesterForm } from './AddEditTesterForm';
import { UpdateRequestList } from './UpdateRequestList';
import type { TesterProfile } from '@/types';

type AdminTab = 'profiles' | 'requests';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
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
    if (res.ok) onLogin();
    else setErr('Invalid credentials');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm bg-bg-card rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-text-primary text-center">Admin Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <Button fullWidth onClick={handleLogin} disabled={loading}>{loading ? 'Logging in…' : 'Login'}</Button>
      </div>
    </div>
  );
}

export function AdminPanel({ isAdmin, onAdminLogin }: { isAdmin: boolean; onAdminLogin: () => void }) {
  const [tab, setTab] = useState<AdminTab>('profiles');
  const [testers, setTesters] = useState<TesterProfile[]>([]);
  const [editing, setEditing] = useState<TesterProfile | null | 'new'>(null);

  const loadTesters = async () => {
    const res = await fetch('/api/testers');
    if (res.ok) setTesters(await res.json());
  };

  useEffect(() => { if (isAdmin) loadTesters(); }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return;
    await fetch(`/api/testers/${id}`, { method: 'DELETE' });
    loadTesters();
  };

  if (!isAdmin) return <AdminLogin onLogin={onAdminLogin} />;

  if (editing) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold text-text-primary mb-4">{editing === 'new' ? 'Add Tester' : 'Edit Tester'}</h2>
        <AddEditTesterForm
          initial={editing !== 'new' ? editing : undefined}
          onSaved={() => { setEditing(null); loadTesters(); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b border-border">
        {(['profiles', 'requests'] as AdminTab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize ${
              tab === t ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-text-secondary'
            }`}>{t === 'profiles' ? 'All Profiles' : 'Pending Requests'}</button>
        ))}
      </div>
      {tab === 'profiles' && (
        <div>
          <div className="p-4">
            <Button fullWidth onClick={() => setEditing('new')}>+ Add New Tester</Button>
          </div>
          {testers.map((t) => (
            <div key={t._id} className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Avatar name={t.fullName} src={t.profilePic} size={40} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primary truncate">{t.fullName}</span>
                  <PostBadge post={t.post} />
                </div>
                <div className="text-xs text-text-secondary truncate">{t.pbs} · {t.office}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(t)} className="text-xs px-2 py-1 min-h-0">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(t._id)} className="text-xs px-2 py-1 min-h-0">Del</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'requests' && <UpdateRequestList />}
    </div>
  );
}

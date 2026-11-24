'use client';
import { useEffect, useState } from 'react';
import {
  Users, Clock, Trophy, ArrowLeftRight,
  Download, Settings, Lock, LockOpen,
  Plus, ChevronRight, LogOut, Shield
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge, SeniorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AddEditTesterForm } from './AddEditTesterForm';
import { UpdateRequestList } from './UpdateRequestList';
import { SeniorityTab } from './SeniorityTab';
import { ExportImportTab } from './ExportImportTab';
import { SettingsTab } from './SettingsTab';
import { AdminMutualTransfer } from './AdminMutualTransfer';
import type { TesterProfile } from '@/types';

type AdminTab = 'profiles' | 'requests' | 'seniority' | 'mutual' | 'export' | 'settings';

/* ── Login ── */
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
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
            <Shield size={28} className="text-accent-blue" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
            <p className="text-text-secondary text-sm mt-1">PBS Meter Tester Directory</p>
          </div>
        </div>
        <div className="bg-bg-card rounded-2xl p-8 border border-border space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter password"
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors" />
          </div>
          {err && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-2.5 text-sm text-red-400">{err}</div>
          )}
          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
            {loading ? 'Verifying...' : 'Login to Admin Panel'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Limit badge ── */
function LimitBadge({ limit }: { limit: number }) {
  const cls = limit === 0 ? 'bg-red-900/40 text-red-400 border-red-700/40' :
              limit <= 2  ? 'bg-amber-900/40 text-amber-400 border-amber-700/40' :
                            'bg-green-900/40 text-green-400 border-green-700/40';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border tabular-nums ${cls}`}>{limit}</span>;
}

/* ── Profiles tab content ── */
function ProfilesTab({ testers, onEdit, onDelete, onToggleLock, lockingId }: {
  testers: TesterProfile[];
  onEdit: (t: TesterProfile | 'new') => void;
  onDelete: (id: string) => void;
  onToggleLock: (t: TesterProfile) => void;
  lockingId: string | null;
}) {
  const [search, setSearch] = useState('');
  const filtered = testers.filter((t) =>
    !search || t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.pbs.toLowerCase().includes(search.toLowerCase()) ||
    t.mobileNumber.includes(search)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1 max-w-xs">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, PBS, mobile..."
            className="w-full bg-bg-elevated border border-border rounded-xl pl-4 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
        </div>
        <button onClick={() => onEdit('new')}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Add New Tester
        </button>
        <span className="text-xs text-text-secondary ml-auto">{filtered.length} / {testers.length} testers</span>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-bg-card border-b border-border z-10">
            <tr className="text-xs text-text-secondary uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Tester</th>
              <th className="text-left px-4 py-3 font-semibold">Post</th>
              <th className="text-left px-4 py-3 font-semibold">PBS</th>
              <th className="text-left px-4 py-3 font-semibold">Office</th>
              <th className="text-left px-4 py-3 font-semibold">Mobile</th>
              <th className="text-left px-4 py-3 font-semibold">Joining</th>
              <th className="text-center px-4 py-3 font-semibold">Limit</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const limit = typeof t.editLimit === 'number' ? t.editLimit : 5;
              const locked = t.isLocked === true || limit === 0;
              return (
                <tr key={t._id} className={`border-b border-border hover:bg-bg-elevated transition-colors ${i % 2 === 0 ? '' : 'bg-bg-card/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={t.fullName} src={t.profilePic} size={36} className="shrink-0" />
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{t.fullName}</div>
                        {t.seniority != null && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <SeniorityBadge seniority={t.seniority} />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PostBadge post={t.post} /></td>
                  <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">{t.pbs}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">{t.office}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs tabular-nums">{t.mobileNumber}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs tabular-nums whitespace-nowrap">
                    {t.joiningDate ? new Date(t.joiningDate).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center"><LimitBadge limit={limit} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => onToggleLock(t)} disabled={lockingId === t._id}
                        title={locked ? 'Unlock' : 'Lock'}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${locked ? 'text-amber-400 bg-amber-900/20 hover:bg-amber-900/40' : 'text-text-secondary hover:text-amber-400 hover:bg-bg-elevated'}`}>
                        {locked ? <Lock size={15} /> : <LockOpen size={15} />}
                      </button>
                      <button onClick={() => onEdit(t)}
                        className="text-xs text-accent-blue hover:bg-accent-blue/10 px-2.5 py-1.5 rounded-lg transition-colors font-medium">
                        Edit
                      </button>
                      <button onClick={() => onDelete(t._id)}
                        className="text-xs text-red-400 hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-text-secondary py-16 text-sm">No testers found</div>
        )}
      </div>
    </div>
  );
}

/* ── Main AdminPanel ── */
export function AdminPanel({ isAdmin, onAdminLogin }: { isAdmin: boolean; onAdminLogin: () => void }) {
  const [tab, setTab]           = useState<AdminTab>('profiles');
  const [testers, setTesters]   = useState<TesterProfile[]>([]);
  const [editing, setEditing]   = useState<TesterProfile | 'new' | null>(null);
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
      method: 'PATCH', headers: { 'x-admin-key': adminKey },
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); alert(e.error ?? 'Failed'); }
    setLockingId(null);
    await loadTesters();
  };

  if (!isAdmin) return <AdminLogin onLogin={handleAdminLogin} />;

  const TABS = [
    { id: 'profiles'  as AdminTab, label: 'Profiles',      Icon: Users,          count: testers.length },
    { id: 'requests'  as AdminTab, label: 'Pending',        Icon: Clock,          count: null },
    { id: 'seniority' as AdminTab, label: 'Seniority',      Icon: Trophy,         count: null },
    { id: 'mutual'    as AdminTab, label: 'Mutual / বদলি',  Icon: ArrowLeftRight, count: null },
    { id: 'export'    as AdminTab, label: 'Export / Import', Icon: Download,       count: null },
    { id: 'settings'  as AdminTab, label: 'Settings',        Icon: Settings,       count: null },
  ];

  /* Edit form modal */
  if (editing !== null) return (
    <div className="min-h-screen bg-bg flex items-start justify-center p-6 pt-10">
      <div className="w-full max-w-2xl bg-bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">
            {editing === 'new' ? 'Add New Tester' : `Edit — ${(editing as TesterProfile).fullName}`}
          </h2>
          <button onClick={() => setEditing(null)} className="text-text-secondary hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">
          <AddEditTesterForm
            initial={editing !== 'new' ? editing as TesterProfile : undefined}
            onSaved={() => { setEditing(null); loadTesters(); }}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-bg">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-bg-card border-r border-border flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-accent-blue" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary leading-tight">PBS Admin</p>
            <p className="text-xs text-text-secondary">Management Panel</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {TABS.map(({ id, label, Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                tab === id
                  ? 'bg-accent-blue/15 text-accent-blue'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}>
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {count !== null && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md tabular-nums ${tab === id ? 'bg-accent-blue/20 text-accent-blue' : 'bg-bg-elevated text-text-secondary'}`}>
                  {count}
                </span>
              )}
              {tab === id && <ChevronRight size={14} className="shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
            <LogOut size={17} />
            Back to Directory
          </a>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-text-primary capitalize">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">PBS Meter Tester Directory</p>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {tab === 'profiles' && (
            <ProfilesTab
              testers={testers}
              onEdit={(t) => setEditing(t)}
              onDelete={handleDelete}
              onToggleLock={handleToggleLock}
              lockingId={lockingId}
            />
          )}
          {tab === 'requests'  && <div className="h-full overflow-y-auto"><UpdateRequestList /></div>}
          {tab === 'seniority' && <div className="h-full overflow-y-auto"><SeniorityTab adminKey={adminKey} /></div>}
          {tab === 'mutual'    && <div className="h-full overflow-y-auto"><AdminMutualTransfer adminKey={adminKey} /></div>}
          {tab === 'export'    && <div className="h-full overflow-y-auto"><ExportImportTab adminKey={adminKey} /></div>}
          {tab === 'settings'  && <div className="h-full overflow-y-auto"><SettingsTab adminKey={adminKey} /></div>}
        </div>
      </main>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalCache } from '@/hooks/useLocalCache';
import { useDeviceId } from '@/hooks/useDeviceId';
import { DirectoryList } from '@/components/directory/DirectoryList';
import { MyProfile } from '@/components/profile/MyProfile';
import { MutualTransferTab } from '@/components/mutual/MutualTransferTab';
import { BottomNav } from '@/components/ui/BottomNav';
import { MobileFrame } from '@/components/ui/MobileFrame';
import { Button } from '@/components/ui/Button';
import type { TesterProfile } from '@/types';

type Tab = 'directory' | 'mutual' | 'profile';

function LoginScreen({ onLogin }: { onLogin: (isNew?: boolean) => void }) {
  const [mobile, setMobile] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!/^01[3-9]\d{8}$/.test(mobile)) {
      setErr('Please enter a valid 11-digit mobile number (e.g. 01XXXXXXXXX)');
      return;
    }
    setLoading(true); setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: mobile }),
    });
    setLoading(false);
    if (res.ok) {
      const d = await res.json();
      onLogin(d.newUser === true);
    } else { const d = await res.json(); setErr(d.error ?? 'Login failed'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent-blue flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">PBS</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary text-center">PBS Meter Tester Directory</h1>
          <p className="text-text-secondary text-sm mt-2 text-center">Enter your registered mobile number to continue</p>
        </div>
        <div className="bg-bg-card rounded-2xl p-6 space-y-4">
          <input type="tel" maxLength={11} value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="01XXXXXXXXX"
            className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-lg text-text-primary text-center tracking-widest focus:outline-none focus:border-accent-blue"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          {err && <p className="text-sm text-red-400 text-center">{err}</p>}
          <Button fullWidth onClick={handleLogin} disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { auth, loading, refetch } = useAuth();
  const [tab, setTab] = useState<Tab>('directory');
  const deviceId = useDeviceId();
  const { testers, syncing, manualSync, updateLocalProfile } = useLocalCache(!loading && !!auth);
  const [myProfile, setMyProfile] = useState<TesterProfile | null>(null);

  useEffect(() => {
    if (auth?.userId) {
      const p = testers.find((t) => t._id === auth.userId);
      if (p) setMyProfile(p);
    }
  }, [auth, testers]);

  const handleUpdate = (updated: TesterProfile) => {
    setMyProfile(updated);
    updateLocalProfile(updated);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-text-secondary">Loading...</div>
    </div>
  );

  if (!auth) return (
    <MobileFrame>
      <LoginScreen onLogin={(isNew) => refetch()} />
    </MobileFrame>
  );

  return (
    <MobileFrame>
      <div className="h-full bg-bg flex flex-col overflow-hidden">
        <main className="flex-1 min-h-0 overflow-y-auto pb-14 lg:pb-0">
          {tab === 'directory' && <DirectoryList testers={testers} syncing={syncing} onSync={manualSync} />}
          {tab === 'mutual'    && <MutualTransferTab />}
          {tab === 'profile'   && (
            myProfile
              ? <MyProfile profile={myProfile} deviceId={deviceId} onUpdate={handleUpdate} />
              : <div className="p-8 text-center text-text-secondary text-sm">Profile not found. Contact admin.</div>
          )}
        </main>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </MobileFrame>
  );
}
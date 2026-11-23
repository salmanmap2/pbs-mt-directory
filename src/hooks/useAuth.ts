'use client';
import { useEffect, useState } from 'react';
import type { AuthPayload } from '@/types';

export function useAuth() {
  const [auth, setAuth] = useState<AuthPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) setAuth(await res.json());
      else setAuth(null);
    } catch {
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuth(); }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuth(null);
    localStorage.removeItem('pbs_testers_cache');
    localStorage.removeItem('pbs_testers_last_sync');
  };

  return { auth, loading, logout, refetch: fetchAuth };
}

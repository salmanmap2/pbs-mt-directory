'use client';
import { useCallback, useEffect, useState } from 'react';
import type { TesterProfile } from '@/types';

const CACHE_KEY = 'pbs_testers_cache';
const SYNC_KEY = 'pbs_testers_last_sync';

export function useLocalCache(authenticated: boolean) {
  const [testers, setTesters] = useState<TesterProfile[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const saveCache = (data: TesterProfile[], ts: string) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(SYNC_KEY, ts);
    setLastSync(ts);
  };

  const fullLoad = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/testers');
      const data: TesterProfile[] = await res.json();
      const ts = new Date().toISOString();
      saveCache(data, ts);
      setTesters(data);
    } finally {
      setSyncing(false);
    }
  }, []);

  const deltaSync = useCallback(async (since: string) => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/testers/sync?since=${encodeURIComponent(since)}`);
      const { updated, deleted }: { updated: TesterProfile[]; deleted: string[] } = await res.json();
      setTesters((prev) => {
        let next = prev.filter((t) => !deleted.includes(t._id));
        updated.forEach((u) => {
          const idx = next.findIndex((t) => t._id === u._id);
          if (idx >= 0) next[idx] = u; else next.push(u);
        });
        const ts = new Date().toISOString();
        saveCache(next, ts);
        return next;
      });
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const cached = localStorage.getItem(CACHE_KEY);
    const since = localStorage.getItem(SYNC_KEY);
    if (cached && since) {
      setTesters(JSON.parse(cached));
      setLastSync(since);
      deltaSync(since);
    } else {
      fullLoad();
    }
  }, [authenticated, deltaSync, fullLoad]);

  const manualSync = useCallback(() => {
    const since = localStorage.getItem(SYNC_KEY);
    if (since) deltaSync(since); else fullLoad();
  }, [deltaSync, fullLoad]);

  const updateLocalProfile = (profile: TesterProfile) => {
    setTesters((prev) => {
      const next = prev.map((t) => t._id === profile._id ? profile : t);
      const ts = new Date().toISOString();
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      localStorage.setItem(SYNC_KEY, ts);
      return next;
    });
  };

  return { testers, syncing, lastSync, manualSync, fullLoad, updateLocalProfile };
}

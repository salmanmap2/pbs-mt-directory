'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { UpdateRequest } from '@/types';

export function UpdateRequestList() {
  const [requests, setRequests] = useState<UpdateRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/update-requests');
    if (res.ok) setRequests(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`/api/admin/update-requests/${id}/${action}`, { method: 'POST' });
    load();
  };

  if (loading) return <div className="text-center text-text-secondary py-8">Loading…</div>;
  if (requests.length === 0) return <div className="text-center text-text-secondary py-8">No pending requests</div>;

  return (
    <div className="space-y-3 p-4">
      {requests.map((r) => (
        <div key={r._id} className="bg-bg-elevated rounded-xl p-4">
          <div className="text-sm text-text-primary font-semibold mb-1">
            {typeof r.testerId === 'object' ? r.testerId.fullName : r.testerId}
          </div>
          <div className="text-xs text-text-secondary mb-2">Device: {r.deviceId}</div>
          <pre className="text-xs text-text-secondary overflow-x-auto mb-3">{JSON.stringify(r.proposedChanges, null, 2)}</pre>
          <div className="flex gap-2">
            <Button onClick={() => act(r._id, 'approve')} className="flex-1">Approve</Button>
            <Button variant="danger" onClick={() => act(r._id, 'reject')} className="flex-1">Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

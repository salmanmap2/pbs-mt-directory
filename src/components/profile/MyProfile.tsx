'use client';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge, SeniorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EditProfileForm } from './EditProfileForm';
import type { TesterProfile } from '@/types';

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="bg-bg-elevated rounded-xl p-3 mb-2">
      <div className="text-xs text-text-secondary uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm text-text-primary">{value}</div>
    </div>
  );
}

export function MyProfile({ profile, deviceId, onUpdate }:
  { profile: TesterProfile; deviceId: string; onUpdate: (p: TesterProfile) => void }) {
  const [editing, setEditing] = useState(false);
  const [pendingMsg, setPendingMsg] = useState('');

  const handleSaved = (updated: TesterProfile | null, pending: boolean) => {
    if (pending) {
      setPendingMsg('আপনার পরিবর্তনের অনুরোধ Admin-এর কাছে পাঠানো হয়েছে।');
      setEditing(false);
    } else if (updated) {
      onUpdate(updated);
      setEditing(false);
      setPendingMsg('');
    }
  };

  const limit = typeof profile.editLimit === 'number' ? profile.editLimit : 5;
  const isLocked = profile.isLocked === true || limit === 0;
  const needsApproval = !isLocked && limit <= 2;

  return (
    <div className="p-4">
      {!editing ? (
        <>
          <div className="flex flex-col items-center mb-6">
            <Avatar name={profile.fullName} src={profile.profilePic} size={80} className="mb-3" />
            <h2 className="text-lg font-bold text-text-primary">{profile.fullName}</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <PostBadge post={profile.post} />
              {profile.seniority != null && (
                <>
                  <span className="text-text-secondary text-xs">-</span>
                  <SeniorityBadge seniority={profile.seniority} />
                </>
              )}
            </div>
          </div>

          {pendingMsg && (
            <p className="text-sm text-blue-400 bg-blue-900/30 rounded-xl p-3 mb-4">{pendingMsg}</p>
          )}

          <InfoRow label="PBS" value={profile.pbs} />
          <InfoRow label="Office" value={profile.office} />
          <InfoRow label="Mobile" value={profile.mobileNumber} />
          <InfoRow label="WhatsApp" value={profile.whatsappNumber} />
          <InfoRow label="Home District" value={profile.ownDistrict} />
          <InfoRow label="Joining Date" value={profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-GB') : undefined} />
          <InfoRow label="Transfer Choice 1" value={profile.transferChoice1} />
          <InfoRow label="Transfer Choice 2" value={profile.transferChoice2} />
          <InfoRow label="Transfer Choice 3" value={profile.transferChoice3} />
          <InfoRow label="Facebook" value={profile.facebookUrl} />

          {isLocked ? (
            <div className="mt-4 flex items-center justify-center gap-2 bg-red-900/20 border border-red-700/40 rounded-xl py-3 text-sm text-red-400">
              <Lock size={15} />
              <span>Profile locked — Admin-এর সাথে যোগাযোগ করুন</span>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                needsApproval
                  ? 'bg-amber-900/20 border border-amber-700/40 text-amber-400'
                  : 'bg-bg-elevated text-text-secondary'
              }`}>
                <span>Edit Limit:</span>
                <span className="font-bold text-sm">{limit}</span>
                {needsApproval && <span>— পরবর্তী edit-এ Admin approval লাগবে</span>}
              </div>
              <Button fullWidth onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </>
      ) : (
        <EditProfileForm profile={profile} deviceId={deviceId} onSaved={handleSaved} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
}
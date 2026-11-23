'use client';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge } from '@/components/ui/Badge';
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
    if (pending) setPendingMsg('Your update request has been submitted for admin approval.');
    else if (updated) { onUpdate(updated); setEditing(false); }
  };

  return (
    <div className="p-4">
      {!editing ? (
        <>
          <div className="flex flex-col items-center mb-6">
            <Avatar name={profile.fullName} src={profile.profilePic} size={80} className="mb-3" />
            <h2 className="text-lg font-bold text-text-primary">{profile.fullName}</h2>
            <PostBadge post={profile.post} />
          </div>
          {pendingMsg && <p className="text-sm text-blue-400 bg-blue-900/30 rounded-xl p-3 mb-4">{pendingMsg}</p>}
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
          <Button fullWidth onClick={() => setEditing(true)} className="mt-4">Edit Profile</Button>
        </>
      ) : (
        <EditProfileForm profile={profile} deviceId={deviceId} onSaved={handleSaved} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
}

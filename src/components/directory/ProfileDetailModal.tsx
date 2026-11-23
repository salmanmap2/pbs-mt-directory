'use client';
import { X, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated rounded-xl p-3 mb-2">
      <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}

export function ProfileDetailModal({ tester, onClose }: { tester: TesterProfile; onClose: () => void }) {
  const wa = tester.whatsappNumber?.replace(/^0/, '880');
  return (
    <Modal onClose={onClose}>
      <div className="relative p-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-white">
          <X size={22} />
        </button>
        <div className="flex flex-col items-center mb-4">
          <Avatar name={tester.fullName} src={tester.profilePic} size={80} className="mb-3" />
          <h2 className="text-lg font-bold text-text-primary text-center">{tester.fullName}</h2>
          <PostBadge post={tester.post} />
        </div>
        <InfoCard label="Office">{tester.office} — {tester.pbs}</InfoCard>
        {tester.mobileNumber && <InfoCard label="Mobile">{tester.mobileNumber}</InfoCard>}
        {tester.whatsappNumber && <InfoCard label="WhatsApp">{tester.whatsappNumber}</InfoCard>}
        <InfoCard label="Home District">{tester.ownDistrict}</InfoCard>
        <InfoCard label="Joining Date">{tester.joiningDate ? new Date(tester.joiningDate).toLocaleDateString('en-GB') : '—'}</InfoCard>
        {(tester.transferChoice1 || tester.transferChoice2 || tester.transferChoice3) && (
          <InfoCard label="Transfer Choices">
            <div>{tester.transferChoice1 || '—'}</div>
            <div>{tester.transferChoice2 || '—'}</div>
            <div>{tester.transferChoice3 || '—'}</div>
          </InfoCard>
        )}
        <div className="flex gap-3 mt-4">
          {tester.mobileNumber && (
            <a href={`tel:${tester.mobileNumber}`} className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 text-sm font-semibold min-h-[44px]">
              <Phone size={18} /> Call
            </a>
          )}
          {tester.whatsappNumber && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold min-h-[44px]">
              <MessageCircle size={18} /> Chat
            </a>
          )}
          {tester.facebookUrl && (
            <a href={tester.facebookUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-3 text-sm font-semibold min-h-[44px]">
              <ExternalLink size={18} /> FB
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}

'use client';
import { X, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge, SeniorityBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated rounded-xl px-3 py-2.5">
      <div className="text-xs text-text-secondary uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}

export function ProfileDetailModal({ tester, onClose }: { tester: TesterProfile; onClose: () => void }) {
  const wa = tester.whatsappNumber?.replace(/^0/, '880');
  const transferChoices = [tester.transferChoice1, tester.transferChoice2, tester.transferChoice3].filter(Boolean).join(', ');

  return (
    <Modal onClose={onClose}>
      <div className="relative px-4 pt-4 pb-4">
        <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-white">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-3">
          <Avatar name={tester.fullName} src={tester.profilePic} size={64} className="mb-2" />
          <h2 className="text-base font-bold text-text-primary text-center leading-tight">{tester.fullName}</h2>
          <div className="mt-1 flex items-center gap-1.5">
            <PostBadge post={tester.post} />
            {tester.seniority != null && (
              <>
                <span className="text-text-secondary text-xs">-</span>
                <SeniorityBadge seniority={tester.seniority} />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <InfoCard label="Office">{tester.office} — {tester.pbs}</InfoCard>
          <div className="grid grid-cols-2 gap-1.5">
            {tester.mobileNumber
              ? <InfoCard label="Mobile">{tester.mobileNumber}</InfoCard>
              : <InfoCard label="Mobile">—</InfoCard>}
            {tester.whatsappNumber
              ? <InfoCard label="WhatsApp">{tester.whatsappNumber}</InfoCard>
              : <InfoCard label="WhatsApp">—</InfoCard>}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <InfoCard label="Home District">{tester.ownDistrict}</InfoCard>
            <InfoCard label="Joining Date">
              {tester.joiningDate ? new Date(tester.joiningDate).toLocaleDateString('en-GB') : '—'}
            </InfoCard>
          </div>
          {transferChoices && (
            <InfoCard label="Transfer Choices">{transferChoices}</InfoCard>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {tester.mobileNumber && (
            <a href={`tel:${tester.mobileNumber}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-white rounded-xl py-2.5 text-xs font-semibold min-h-[44px]">
              <Phone size={16} /> Call
            </a>
          )}
          {tester.whatsappNumber && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-xs font-semibold min-h-[44px]">
              <MessageCircle size={16} /> Chat
            </a>
          )}
          {tester.facebookUrl && (
            <a href={tester.facebookUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-2.5 text-xs font-semibold min-h-[44px]">
              <ExternalLink size={16} /> FB
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
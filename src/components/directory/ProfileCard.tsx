'use client';
import { ChevronRight, Building2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge, SeniorityBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

export function ProfileCard({ tester, onClick }: { tester: TesterProfile; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border hover:bg-bg-elevated active:bg-bg-elevated cursor-pointer">
      <Avatar name={tester.fullName} src={tester.profilePic} size={38} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-text-primary truncate">{tester.fullName}</span>
          <PostBadge post={tester.post} />
          {tester.seniority != null && (
            <>
              <span className="text-text-secondary text-xs">-</span>
              <SeniorityBadge seniority={tester.seniority} />
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
          <Building2 size={11} className="shrink-0" />
          <span className="truncate">{tester.pbs}</span>
          <span className="mx-0.5">·</span>
          <span className="truncate">{tester.office}</span>
        </div>
      </div>
      <ChevronRight size={14} className="text-text-secondary shrink-0" />
    </div>
  );
}
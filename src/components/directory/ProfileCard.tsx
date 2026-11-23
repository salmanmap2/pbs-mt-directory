'use client';
import { ChevronRight, Building2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PostBadge } from '@/components/ui/Badge';
import type { TesterProfile } from '@/types';

export function ProfileCard({ tester, onClick }: { tester: TesterProfile; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-elevated active:bg-bg-elevated cursor-pointer">
      <Avatar name={tester.fullName} src={tester.profilePic} size={44} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary truncate">{tester.fullName}</span>
          <PostBadge post={tester.post} />
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
          <Building2 size={12} className="shrink-0" />
          <span className="truncate">{tester.pbs}</span>
          <span className="mx-1">·</span>
          <span className="truncate">{tester.office}</span>
        </div>
      </div>
      <ChevronRight size={16} className="text-text-secondary shrink-0" />
    </div>
  );
}

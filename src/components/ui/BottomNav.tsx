'use client';
import { Home, User, Shield } from 'lucide-react';

interface Props { active: 'directory' | 'profile' | 'admin'; onChange: (t: 'directory' | 'profile' | 'admin') => void; }

export function BottomNav({ active, onChange }: Props) {
  const tabs = [
    { id: 'directory' as const, label: 'Directory', Icon: Home },
    { id: 'profile' as const, label: 'My Profile', Icon: User },
    { id: 'admin' as const, label: 'Admin', Icon: Shield },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-border lg:hidden">
      <div className="flex">
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 min-h-[56px] ${
              active === id ? 'text-accent-blue' : 'text-text-secondary'
            }`}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

'use client';
import { useState } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function AdminPanelPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="sticky top-0 z-40 bg-bg-card border-b border-border flex items-center justify-between px-4 py-3">
        <h1 className="text-base font-bold text-text-primary">PBS MT — Admin</h1>
        {isAdmin && (
          <a
            href="/"
            className="text-xs text-text-secondary hover:text-white py-1 px-3 rounded-lg bg-bg-elevated"
          >
            Back to Directory
          </a>
        )}
      </header>
      <main className="flex-1 overflow-y-auto">
        <AdminPanel isAdmin={isAdmin} onAdminLogin={() => setIsAdmin(true)} />
      </main>
    </div>
  );
}
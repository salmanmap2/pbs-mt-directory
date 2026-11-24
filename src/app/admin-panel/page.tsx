'use client';
import { useState } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function AdminPanelPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <AdminPanel isAdmin={isAdmin} onAdminLogin={() => setIsAdmin(true)} />
    </div>
  );
}
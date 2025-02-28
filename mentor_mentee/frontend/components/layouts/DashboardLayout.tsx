'use client';

import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="flex-1">
        <Header user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 
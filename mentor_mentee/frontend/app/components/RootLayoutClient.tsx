'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 
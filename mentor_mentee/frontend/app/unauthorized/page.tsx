'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // If user is logged in, redirect to their dashboard after 3 seconds
      const timer = setTimeout(() => {
        router.push(`/${user.role}/dashboard`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page. 
            {user && "Redirecting you to your dashboard..."}
          </p>
        </div>
      </div>
    </div>
  );
} 
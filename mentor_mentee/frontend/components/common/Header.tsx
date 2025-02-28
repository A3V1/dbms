'use client';

import Link from 'next/link';

export default function Header({ user }: { user: any }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Mentor Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user.email}</span>
          <Link href="/logout" className="text-gray-600 hover:text-gray-900">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
} 